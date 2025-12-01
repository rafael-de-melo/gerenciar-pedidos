const { createOrder, getOrderById, getAllOrders, deleteOrder, updateOrder } = require('../repositories/orderRepository');
const { mapRequestToOrderModel, mapOrderModelToResponse } = require('../services/orderMapper');

async function createOrderHandler(req, res) {
    try {
        const body = req.body;

        if (!body.numeroPedido || !body.valorTotal || !body.dataCriacao || !Array.isArray(body.items)) {
        return res.status(400).json({ message: 'Payload inválido' });
        }

        const orderModel = mapRequestToOrderModel(body);
        await createOrder(orderModel);

        // você pode devolver o modelo do banco ou algo mais customizado
        return res.status(201).json(mapOrderModelToResponse(orderModel));
  } catch (err) {
        console.error('Erro ao criar pedido:', err);
        return res.status(500).json({ message: 'Erro interno ao criar pedido' });
  }
}

async function getOrderHandler(req, res) {
  try {
        const orderId = req.params.orderId;

        if (!orderId) {
          return res.status(400).json({ message: 'Parâmetro orderId é obrigatório' });
        }

        const order = await getOrderById(orderId);

        if (!order) {
          return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        return res.status(200).json(mapOrderModelToResponse(order));
  } catch (err) {
        console.error('Erro ao buscar pedido:', err);
        return res.status(500).json({ message: 'Erro interno ao listar pedidos' });
  }
}

async function getAllOrdersHandler(req, res) {
    try {
        const orders = await getAllOrders();
        return res.status(200).json(
          orders.map(mapOrderModelToResponse)
        );
    } catch (err) {
       console.error('Erro ao buscar pedido:', err);
      return res.status(500).json({ message: 'Erro interno ao buscar pedido' }); 
    }
}

async function deleteOrderHandler(req, res) {
  try {
    const orderId = req.params.orderId;

    if (!orderId) {
      return res.status(400).json({ message: 'Parâmetro orderId é obrigatório' });
    }

    const deleted = await deleteOrder(orderId);

    if(deleted === 0) return res.status(404).json({message: 'Pedido não existe no banco de dados'})
    return res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar pedido', err);
    return res.status(500).json({ message: 'Erro interno ao deletar pedido' }); 
  }
}

async function updateOrderHandler(req, res) {
  try {
    const body = req.body;
    const orderId = req.params.orderId;

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ message: 'É necessário enviar ao menos um item' });
    }

    const itemsModel = body.items.map((i) =>({
      productId: i.productId ?? i.idItem,
      quantity: i.quantity ?? i.quantidadeItem,
      price: i.price ?? i.valorItem,
    }));

    const result = await updateOrder(orderId, itemsModel);

    if (result.orderNotFound) return res.status(404).json({ message: "Pedido não existe" });
    if (result.itemNotFound) return res.status(400).json({ message: `Item ${result.itemNotFound} não existe neste pedido` });

    return res.status(200).json({ message: "Itens atualizados com sucesso" }); 
  } catch (error) {
    console.error('Erro ao atualizar pedido:', err);
    return res.status(500).json({ message: 'Erro interno ao atualizar pedido' });
  }
}

module.exports = {
  createOrderHandler,
  getOrderHandler,
  getAllOrdersHandler,
  deleteOrderHandler,
  updateOrderHandler
};