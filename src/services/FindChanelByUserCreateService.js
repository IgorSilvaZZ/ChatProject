const { ChanelsRepositories } = require('../repositories/ChanelsRepositories'); 
const { Op } = require('sequelize')

class FindChanelByUserCreateService {

    async execute({ fkUser, fkUserParticipant }){

        const chanel = ChanelsRepositories.findOne({ 
            where: { 
                [Op.or]: [ 
                    { fkUserCreate: fkUser }, 
                    { fkUserCreate: fkUserParticipant } 
                ] 
            }
        })

        return chanel;

    }

}

module.exports = { FindChanelByUserCreateService }