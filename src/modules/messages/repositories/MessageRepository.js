const { Message } = require("../../../entities/Message");
const { QueryTypes } = require("sequelize");

class MessageRepository extends Message {
  /* Query Row */
  static async listAllConversation(fkUser) {
    const messages = await this.sequelize.query(
      `
        select 
        tbUsers.id, tbUsers.name, tbUsers.email, tbConnections.socket_id, tbMessages.createdAt
        from tbMessages
        inner join tbConnections
        on tbMessages.fkUserSender = tbConnections.user_id
        inner join tbUsers
        on tbConnections.user_id = tbUsers.id
        where tbMessages.fkUserReceiver = ${fkUser}
        group by tbUsers.id
        union
        select 
        tbUsers.id, tbUsers.name, tbUsers.email, tbConnections.socket_id, tbMessages.createdAt
        from tbMessages
        inner join tbConnections
        on tbMessages.fkUserSender = tbConnections.user_id
        inner join tbUsers
        on tbConnections.user_id = tbUsers.id
        where tbMessages.fkUserReceiver = ${fkUser}
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
