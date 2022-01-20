'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactions = sequelize.define(
    'transactions',
    {
      userId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      token: DataTypes.STRING,
      status: DataTypes.STRING,
    },
   );
  transactions.associate = function(models) {
    // associations can be defined here
    transactions.belongsTo(models.users, { as: 'user' });
  };
  return transactions;
};