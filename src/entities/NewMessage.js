const { Model, DataTypes } = require("sequelize");

class NewMessage extends Model {
  static init(sequelize) {
    super.init({
      message: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  }
}
