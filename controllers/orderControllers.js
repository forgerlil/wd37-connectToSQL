const pool = require('../DB/sqlConnection');

const getAllOrders = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders;');
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1;', [
      id,
    ]);
    if (!rows.length) throw new Error('Order not found');
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: error.message });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { price, user_id } = req.body;
    if (!price || !user_id) throw new Error('Missing data');

    const {
      rows: [order],
    } = await pool.query(
      `INSERT INTO orders (price, date, user_id) VALUES ($1, CURRENT_TIMESTAMP, $2) RETURNING *`,
      [price, user_id]
    );

    return res.status(201).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, user_id } = req.body;
    if (!price || !user_id) throw new Error('Missing data');

    const {
      rows: [order],
    } = await pool.query(
      'UPDATE orders SET price=$1, user_id=$2 WHERE id=$3 RETURNING *',
      [price, user_id, id]
    );

    return res.json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM orders WHERE id=$1', [id]);

    return res.json({ success: 'Order deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  placeOrder,
  updateOrder,
  removeOrder,
};
