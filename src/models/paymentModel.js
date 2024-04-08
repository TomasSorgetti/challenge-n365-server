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
        allowNull: false,
      },
      paymentType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["check", "debit", "transfer", "credit"]],
        },
      },
      addressee: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentDate: {
        // type: DataTypes.DATE,
        type: DataTypes.STRING,
        allowNull: false,
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
