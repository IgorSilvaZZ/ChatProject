const { Model, DataTypes } = require("sequelize");

class NewMessage extends Model {
  static init(sequelize) {
    super.init(
      {
        message: DataTypes.TEXT,
        fkConversation: DataTypes.INTEGER,
        sendMessage: DataTypes.INTEGER,
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
    this.belongsTo(models.NewConversation, {
      foreignKey: "fkConversation",
      as: "conversation",
    });

    this.belongsTo(models.User, {
      foreignKey: "sendMessage",
      as: "send_user_message",
    });
  }
}

module.exports = { NewMessage };
