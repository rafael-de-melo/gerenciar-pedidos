function mapRequestToOrderModel(body) {
  const order = {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: formatDateToYYYYMMDD(body.dataCriacao),
    items: (body.items || []).map((item) => ({
      productId: Number(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };

  return order;
}

function formatDateToYYYYMMDD(isoString) {
  const d = new Date(isoString);
  return d.toISOString().slice(0, 10);  
}

module.exports = {
  mapRequestToOrderModel,
};