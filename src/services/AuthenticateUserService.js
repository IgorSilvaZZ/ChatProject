const { UsersRepositories } = require('../repositories/UsersRepositories');
const { compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { secret } = require('../config/auth.json');

class AuthenticateUserService {

    async execute({ email, password }){

        const user = await UsersRepositories.findOne({ where: { email } });

        if(!user){
            throw new Error('User not found!');
        }

        if(!await compare(password, user.password)){
            throw new Error('Email/Password incorrect!')
        }

        const token = sign({ email: user.email }, secret, {
            subject: String(user.id),
            expiresIn: '1d'
        });

        return token;

    }   

}

module.exports = { AuthenticateUserService }