require('dotenv').config();
const express = require('express');
const app = express();
const {
  getAllUsers,
  getOneUser,
  getOrdersFromUser,
  createUser,
  updateUser,
  deactivateUser,
  deleteUser,
} = require('./controllers/userControllers');

const {
  getAllOrders,
  getOrder,
  placeOrder,
  updateOrder,
  removeOrder,
} = require('./controllers/orderControllers');

const port = process.env.PORT || 8000;

app.use(express.json());

app.route('/users').get(getAllUsers).post(createUser);
app.route('/users/:id').get(getOneUser).put(updateUser).delete(deleteUser);
app.route('/users/:id/orders').get(getOrdersFromUser);
app.route('/users/:id/check-inactive').put(deactivateUser);

app.route('/orders').get(getAllOrders).post(placeOrder);
app.route('/orders/:id').get(getOrder).put(updateOrder).delete(removeOrder);

app.listen(port, () => console.log(`Server up on port ${port}`));
