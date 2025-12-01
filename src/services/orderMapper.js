function mapRequestToOrderModel(body) {
  const order = {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: formatDateToYYYYMMDD(body.dataCriacao),
    items: (body.items || []).map((item) => ({
      productId: item.idItem,
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };

  return order;
}

function mapOrderModelToResponse(model) {
  const response = {
    numeroPedido: model.orderId,
    valorTotal: model.value,
    dataCriacao: model.creationDate,
    items: (model.items || []).map((item) => ({
      idItem: item.productId,
      quantidadeItem: item.quantity,
      valorItem: item.price,
    }))
  }

  return response;
}

function formatDateToYYYYMMDD(isoString) {
  const d = new Date(isoString);
  return d.toISOString().slice(0, 10);  
}

module.exports = {
  mapRequestToOrderModel,
  mapOrderModelToResponse,
};