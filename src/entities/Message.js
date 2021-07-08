const { Model, DataTypes } = require('sequelize');

class Message extends Model {
    
    static init(sequelize){
        super.init({
            message: DataTypes.TEXT,
            fkUserSender: DataTypes.INTEGER,
            fkUserReceiver: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'tbMessages',
        })
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'fkUserSender', as: 'user_sender' })
        this.belongsTo(models.User, { foreignKey: 'fkUserReceiver', as: 'user_receiver' })
    }

}

module.exports = { Message }