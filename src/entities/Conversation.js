const { Model, DataTypes } = require("sequelize");

class Conversation extends Model {
  static init(sequelize) {
    super.init(
      {
        fkUserSender: DataTypes.INTEGER,
        fkUserReceiver: DataTypes.INTEGER,
        fkGroup: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "tbConversations",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "fkUserSender",
      as: "user_sender",
    });

    this.belongsTo(models.User, {
      foreignKey: "fkUserReceiver",
      as: "user_receiver",
    });

    this.belongsTo(models.Room, {
      foreignKey: "fkGroup",
      as: "conversation_group",
    });
  }
}

module.exports = { Conversation };
