const { Model, DataTypes } = require("sequelize");

class NewConversation extends Model {
  static init(sequelize) {
    super.init(
      {
        fkUserSender: DataTypes.INTEGER,
        fkUserReceiver: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updateAt: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "tbNewConversations",
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
  }
}

module.exports = { NewConversation };
