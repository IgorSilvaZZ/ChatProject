const { UsersRepositories } = require('../repositories/UsersRepositories');
const { hash } = require('bcryptjs');

class CreateUserService {

    async execute({ name, email, password }){

        if(!email){
            throw new Error('Email incorrect');
        }

        const userExists = await UsersRepositories.findOne({ where: { email } });

        if(userExists){
            throw new Error("User already exists");
        } 

        const hashPassword = await hash(password, 8);

        const user = await UsersRepositories.create({
            name,
            email,
            password: hashPassword
        })

        return user;

    }

}

module.exports = { CreateUserService }