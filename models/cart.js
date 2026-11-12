'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    calculateSubtotal() {
      if (this.Product) {
        return this.quantity * this.Product.price;
      }
      return 0;
    }
    
    static async getUserCarts(userId) {
      return await Cart.findAll({
        where: { userId },
        include: ['Product'],
        order: [['createdAt', 'ASC']]
      });
    }
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'userId' })
      Cart.belongsTo(models.Product, { foreignKey: 'productId' })
    }
  }
  Cart.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};