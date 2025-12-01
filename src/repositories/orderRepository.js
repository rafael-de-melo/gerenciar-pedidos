const db = require('../database/db');

async function createOrder(order) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      'INSERT INTO Orders (orderId, value, creationDate) VALUES (?, ?, ?)',
      [order.orderId, order.value, order.creationDate]
    );

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
  const connection = await db.getConnection();
  try {
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
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function getAllOrders() {
  const connection = await db.getConnection();
  try {
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
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function deleteOrder(orderId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      'DELETE FROM Items WHERE orderId = ?',
      [orderId]
    );
    const [orderDeleted] = await connection.query(
      'DELETE FROM Orders WHERE orderId = ?',
      [orderId]
    )

    await connection.commit();
    return orderDeleted.affectedRows;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function updateOrder(orderId, items) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [orderRows] = await connection.query(
      'SELECT orderId FROM Orders WHERE orderId = ?',
      [orderId]
    );

    if (orderRows.length === 0) {
      await connection.rollback();
      return { orderNotFound: true };
    }

    for (const item of items){
      const [rows] = await connection.query(
        'SELECT quantity, price FROM Items WHERE orderId = ? AND productId =?',
        [orderId, item.productId] 
      )

      if (rows.length === 0){
        await connection.rollback();
        return { itemNotFound: item.productId }
      }

      await connection.query(
        'UPDATE Items SET quantity=?, price=? WHERE orderId =? AND productId =?',
        [item.quantity, item.price, orderId, item.productId]
      )
    }

    const [sumRows] = await connection.query(
      'SELECT SUM(price * quantity) AS total FROM Items WHERE orderId =?',
      [orderId]
    )

    const total = sumRows[0].total || 0;
    await connection.query(
      'UPDATE Orders SET value =? WHERE orderId =?',
      [total, orderId]
    )

    await connection.commit();
    return {success: true};
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally{
    connection.release();
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  deleteOrder,
  updateOrder,
};