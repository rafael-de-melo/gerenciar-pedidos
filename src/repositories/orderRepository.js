const db = require('../database/db');

async function createOrder(order) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // insere na tabela Order
    await connection.query(
      'INSERT INTO Orders (orderId, value, creationDate) VALUES (?, ?, ?)',
      [order.orderId, order.value, order.creationDate]
    );

    // insere itens na tabela Items
    const itemsValues = order.items.map((item) => [
      order.orderId,
      item.productId,
      item.quantity,
      item.price,
    ]);

    await connection.query(
      'INSERT INTO Items (orderId, productId, quantity, price) VALUES ?',
      [itemsValues]
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function getOrderById(orderId) {
  const [orderRows] = await db.query(
    'SELECT orderId, value, creationDate FROM Orders WHERE orderId = ?',
    [orderId]
  );

  if (orderRows.length === 0) return null;

  const order = orderRows[0];

  const [itemsRows] = await db.query(
    'SELECT productId, quantity, price FROM Items WHERE orderId = ?',
    [orderId]
  );

  return {
    orderId: order.orderId,
    value: order.value,
    creationDate: order.creationDate,
    items: itemsRows,
  };
}

async function getAllOrders(){
  const [orderRows] = await db.query(
    'SELECT orderId, value, creationDate FROM Orders'
  );

  if (orderRows.length === 0) return null;

  const results = [];

  for (const row of orderRows) {
    const [itemsRows] = await db.query(
      'SELECT productId, quantity, price FROM Items WHERE orderId = ?',
      [row.orderId]
    );

    results.push({
      orderId: row.orderId,
      value: row.value,
      creationDate: row.creationDate,
      items: itemsRows,
    });
  }

  return results;
}

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
};