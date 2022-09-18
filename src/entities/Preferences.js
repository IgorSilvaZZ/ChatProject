const { Model, DataTypes } = require("sequelize");

class Preferences extends Model {
  static init(sequelize) {
    super.init(
      {
        description: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "tbPreferences",
        underscored: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

module.exports = { Preferences };
