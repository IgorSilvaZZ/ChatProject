const { Model, DataTypes } = require('sequelize');

class Chanel extends Model {

    static init(sequelize){
        super.init({
            descChanel: DataTypes.TEXT,
            fkUserCreate: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'tbChanels'
        })
    }

}

module.exports = { Chanel }