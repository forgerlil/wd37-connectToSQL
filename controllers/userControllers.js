const pool = require('../DB/sqlConnection');

const getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users;');
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1;', [id]);
    if (!rows.length) throw new Error('User not found');

    return res.json(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: error.message });
  }
};

const getOrdersFromUser = async (req, res) => {
  try {
    const { id } = req.params;

    const findUser = await pool.query('SELECT * FROM users WHERE id=$1;', [id]);
    if (!findUser.rows.length) throw new Error('User not found');

    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE user_id=$1;',
      [id]
    );
    if (!rows.length) throw new Error('User has not placed any orders');

    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { first_name, last_name, age } = req.body;
    if (!first_name || !last_name || !age) throw new Error('Missing data');

    const {
      rows: [user],
    } = await pool.query(
      'INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *',
      [first_name, last_name, age]
    );

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, age } = req.body;
    if (!first_name || !last_name || !age) throw new Error('Missing data');

    const {
      rows: [user],
    } = await pool.query(
      'UPDATE users SET first_name=$1, last_name=$2, age=$3 WHERE id=$4 RETURNING *',
      [first_name, last_name, age, id]
    );

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE user_id=$1;',
      [id]
    );

    if (rows.length)
      throw new Error('User has placed orders and cannot be set to inactive');

    const {
      rows: [user],
    } = await pool.query(
      'UPDATE users SET active=false WHERE id=$1 RETURNING *;',
      [id]
    );

    if (!user) throw new Error('User not found');

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM users WHERE id=$1', [id]);

    return res.json({ success: 'User deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  getOrdersFromUser,
  createUser,
  updateUser,
  deactivateUser,
  deleteUser,
};
