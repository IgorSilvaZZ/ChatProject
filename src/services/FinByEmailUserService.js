const { UsersRepositories } = require('../repositories/UsersRepositories');

class FinByEmailUserService {

    async execute({ email }){

        const user = await UsersRepositories.findOne({ where: { email } });

        return user;

    }

}

module.exports = { FinByEmailUserService }