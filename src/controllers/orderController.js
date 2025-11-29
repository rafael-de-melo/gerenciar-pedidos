const { createOrder, getOrderById } = require('../repositories/orderRepository');
const { mapRequestToOrderModel } = require('../services/orderMapper');

async function createOrderHandler(req, res) {
  try {
    const body = req.body;

    if (!body.numeroPedido || !body.valorTotal || !body.dataCriacao || !Array.isArray(body.items)) {
      return res.status(400).json({ message: 'Payload inválido' });
    }

    const orderModel = mapRequestToOrderModel(body);

    await createOrder(orderModel);

    // você pode devolver o modelo do banco ou algo mais customizado
    return res.status(201).json(orderModel);
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

    // Se você quiser, pode remapear de volta para o formato da API (numeroPedido, etc.)
    return res.status(200).json(order);
  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    return res.status(500).json({ message: 'Erro interno ao buscar pedido' });
  }
}

module.exports = {
  createOrderHandler,
  getOrderHandler,
};