const { Message } = require("../../../entities/Message");
const { QueryTypes } = require("sequelize");

class MessageRepository extends Message {
  /* Query personalizada */
  static async listAllConversation(fkUser) {
    /* 
            # Query que precisa ser executada
            select tbUsers., tbUsers.name, tbUsers.email
            from tbMessages
            inner join tbUsers
            on tbMessages.fkUserReceiver = tbUsers.id
            where tbMessages.fkUserSender = 1 or tbMessages.fkUserReceiver = 1
            group by tbUsers.id; 
        */

    const messages = await this.sequelize.query(
      `
            select tbUsers.name
            from tbMessages 
            inner join tbUsers
            on tbMessages.fkUserReceiver = tbUsers.id
            where tbMessages.fkUserSender = ${fkUser} or tbMessages.fkUserReceiver = ${fkUser}
            group by tbUsers.id`,
      {
        type: QueryTypes.SELECT,
      }
    );

    return messages;
  }
}

module.exports = { MessageRepository };
