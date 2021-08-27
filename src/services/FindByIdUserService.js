const { UsersRepositories } = require('../repositories/UsersRepositories');

class FindByIdUserService {

    async execute({ id }){

        const user = await UsersRepositories.findOne({ 
            where: { id }, 
            attributes: [ 
                'name',
                'email',
                'password',
            ] 
        });
        
        return user;

    }

}

module.exports = { FindByIdUserService }