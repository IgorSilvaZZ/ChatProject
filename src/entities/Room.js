const { Model, DataTypes } = require("sequelize");

class Room extends Model {
  static init(sequelize) {
    super.init(
      {
        fkAdmin: DataTypes.INTEGER,
        fkParticipant: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "tbRooms",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "fkAdmin",
      as: "user_admin",
    });

    this.belongsTo(models.User, {
      foreignKey: "fkParticipant",
      as: "user_participant",
    });
  }
}

module.exports = { Room };
