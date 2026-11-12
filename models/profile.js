'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Profile.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Profile.init({
    userId: DataTypes.INTEGER,
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Nama lengkap wajib diisi!" },
        notEmpty: { msg: "Nama lengkap wajib diisi!" }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Nomor telepon wajib diisi!" },
        notEmpty: { msg: "Nomor telepon wajib diisi!" }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Alamat pengiriman wajib diisi!" },
        notEmpty: { msg: "Alamat pengiriman wajib diisi!" }
      }
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};