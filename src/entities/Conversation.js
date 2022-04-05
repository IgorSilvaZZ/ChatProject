const { Model, DataTypes } = require("sequelize");

class Conversation extends Model {
  static init(sequelize) {
    super.init(
      {
        fkUserReceiver: DataTypes.INTEGER,
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
      foreignKey: "fkUserReceiver",
      as: "user_receiver",
    });
  }
}

module.exports = { Conversation };
