const { Model, DataTypes } = require("sequelize");

class NewMessage extends Model {
  static init(sequelize) {
    super.init(
      {
        message: DataTypes.TEXT,
        fkConversation: DataTypes.INTEGER,
        statusMessage: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "tbNewMessages",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "fkConversation",
      as: "conversation",
    });
  }
}

module.exports = { NewMessage };
