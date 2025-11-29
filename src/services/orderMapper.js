function mapRequestToOrderModel(body) {
  const order = {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: body.dataCriacao,
    items: (body.items || []).map((item) => ({
      productId: Number(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };

  return order;
}

module.exports = {
  mapRequestToOrderModel,
};