const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Payment = sequelize.define(
    "payment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      paymentType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      addressee: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentDate: {
        // type: DataTypes.DATE,
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "payment",
    }
  );

  return Payment;
};
