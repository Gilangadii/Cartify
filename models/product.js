'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Product.belongsTo(models.User, { foreignKey: 'userId' })
      Product.hasMany(models.Cart, { foreignKey: 'productId' })
      Product.belongsToMany(models.User, { 
        through: models.Cart, 
        foreignKey: 'productId', 
        otherKey: 'userId' 
      })
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name required!"
        },
        notEmpty: {
          msg: "Name required!"
        },
        isTwoWords(value){
          if(value.split(" ").length < 2){
            throw new Error("Minimal name is 2 words!")
          }
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description required!"
        },
        notEmpty: {
          msg: "Description required!"
        },
        isFiveWords(value){
          if(value.split(" ").length < 5){
            throw new Error("Minimal description is 5 words!")
          }
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price required!"
        },
        notEmpty: {
          msg: "Price required!"
        },
        min: {
          args: 1,
          msg: "Minimal price is 1!"
        }
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category required!"
        },
        notEmpty: {
          msg: "Category required!"
        },
      }
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};