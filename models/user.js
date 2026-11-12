'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
    User.hasOne(models.Profile, { foreignKey: 'userId' })
    User.hasMany(models.Product, { foreignKey: 'userId' })
    User.hasMany(models.Cart, { foreignKey: 'userId' })
    User.belongsToMany(models.Product, { 
      through: models.Cart,
      foreignKey: 'userId', 
      otherKey: 'productId' 
    })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email required!"
        },
        notEmpty: {
          msg: "Email required!"
        },
        isEmail: {
          msg: "Invalid email format!"
        },
        async isUnique(value) {
          const user = await User.findOne({ where: { email: value } });
          if (user) {
            throw new Error("Email already registered!");
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password required!"
        },
        notEmpty: {
          msg: "Password required!"
        },
        len: {
          args: [8, 255],
          msg: "Password must be at least 8 characters!"
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(user => {
    const salt = bcrypt.genSaltSync(8);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash
  })
  return User;
};