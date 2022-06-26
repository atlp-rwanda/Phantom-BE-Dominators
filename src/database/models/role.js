'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.permissions, {
        through: models.role_permissions,
        foreignKey: { name: 'role_id', allowNull: true },
        as: 'Role_permissions',
      });

      // this.belongsTo(models.role_permissions, {
      //   foreignKey: { name: 'role_id', allowNull: true },
      //   as: 'role_permissions',
      // });
    }
  }
  Role.init(
    {
      role_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'roles',
    }
  );
  return Role;
};
