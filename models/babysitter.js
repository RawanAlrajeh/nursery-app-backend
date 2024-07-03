const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Babysitter extends Model {
    static associate(models) {
      Babysitter.belongsTo(models.User, { foreignKey: 'nurseryId' });
      Babysitter.hasMany(models.Class, { foreignKey: 'babysitterId' });
    }
  }

  Babysitter.init(
    {
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      idNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nurseryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Babysitter',
      timestamps: true,
    }
  );

  return Babysitter;
};
