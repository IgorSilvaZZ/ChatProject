const { ChanelsRepositories } = require('../repositories/ChanelsRepositories');

class CreateChanelService {

    async execute(params){

        const chanel = await ChanelsRepositories.create(params)

        return chanel;

    }

}

module.exports = { CreateChanelService }