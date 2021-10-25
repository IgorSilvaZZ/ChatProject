class MessagesSerialize {
  handle(messages) {
    let allMessages;

    if (messages.length > 0) {
      allMessages = messages.map((item) => {
        return {
          id: item.id,
          message: item.message,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          idUserSender: item.user_sender.id,
          nameUserSender: item.user_sender.name,
          idUserReceiver: item.user_receiver.id,
        };
      });
    } else {
      allMessages = [];
    }

    //Ordernar as mensagens em ordem crescente conforme o id delas
    allMessages.sort((a, b) => a.id - b.id);

    return allMessages;
  }
}

module.exports = { MessagesSerialize };
