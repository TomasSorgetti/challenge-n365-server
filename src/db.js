require("dotenv").config();
const { Sequelize } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const userModel = require("./models/userModel");
const paymentModel = require("./models/paymentModel");

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  { logging: false }
);

userModel(sequelize);
paymentModel(sequelize);

const { user, payment } = sequelize.models;

user.hasMany(payment);
payment.belongsTo(user, { foreignKey: "userId" });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
