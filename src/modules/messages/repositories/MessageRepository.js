const { Message } = require("../../../entities/Message");
const { QueryTypes } = require("sequelize");

class MessageRepository extends Message {
  /* Query Row */
  static async listAllConversation(fkUser) {
    const messages = await this.sequelize.query(
      `
        select 
        tbUsers.id, tbUsers.name, tbUsers.email, tbMessages.createdAt
        from tbMessages
        inner join tbUsers
        on tbMessages.fkUserSender = tbUsers.id
        where tbMessages.fkUserReceiver = ${fkUser}
        group by tbUsers.id
        union
        select 
        tbUsers.id, tbUsers.name, tbUsers.email, tbMessages.createdAt
        from tbMessages
        inner join tbUsers
        on tbMessages.fkUserReceiver = tbUsers.id
        where tbMessages.fkUserSender = ${fkUser}
        group by tbUsers.id
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return messages;
  }
}

module.exports = { MessageRepository };
