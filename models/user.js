"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM("admin", "mother", "nursery"),
        defaultValue: "mother",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};