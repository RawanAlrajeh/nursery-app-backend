const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsTo(models.Babysitter, { foreignKey: 'babysitterId' });
      Class.belongsTo(models.User, { foreignKey: 'nurseryId' });
    }
  }

  Class.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      babysitterId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Babysitters',
          key: 'id',
        },
      },
      nurseryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Class',
    }
  );

  return Class;
};
