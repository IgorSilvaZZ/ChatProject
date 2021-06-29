const { Model, DataTypes } = require('sequelize');

class User extends Model {

    static init(connection){
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        }, {
            sequelize: connection,
            freezeTableName: true,
            tableName: 'tbUsers',
            underscored: true,
        })
    }

}

module.exports = { User };