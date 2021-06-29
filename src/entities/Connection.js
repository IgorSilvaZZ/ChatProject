const { Model ,DataTypes } = require('sequelize');

class Connection extends Model {

    static init(sequelize){
        super.init({
            user_id: { type: DataTypes.INTEGER },
            socket_id: { type: DataTypes.INTEGER }
        },{
            sequelize,
            freezeTableName: true,
            tableName: 'tbConnections'
        })
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }

}

module.exports = { Connection }