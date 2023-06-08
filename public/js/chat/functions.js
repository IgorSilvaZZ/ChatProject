function listMessagesUsers(params, templateName, idUser) {
  const containerChat = document.getElementById(`containerChat`);

  const chatContainer = document.getElementById(`chatContainer${idUser}`);

  if (chatContainer) {
    const template = document.getElementById(templateName).innerHTML;

    const rendered = Mustache.render(template, {
      name: params.nameUser,
      message: params.message,
      date: dayjs(params.createdAt).format("DD/MM/YY HH:mm:ss"),
    });

    chatContainer.innerHTML += rendered;

    containerChat.scrollTo(0, containerChat.scrollHeight);
  }
}

function updateListAllConversations(lastMessagesConversations) {
  console.log(lastMessagesConversations);
  if (lastMessagesConversations.length > 0) {
    if (document.getElementById("notFoundMessages")) {
      document.getElementById("notFoundMessages").style.display = "none";
    }

    document.getElementById("list_peoples").innerHTML = "";

    let templateListConversations = document.getElementById(
      "template_conversations"
    ).innerHTML;

    lastMessagesConversations.forEach(
      ({ conversation, message, fkConversation }) => {
        const nameUserReceiverProperty =
          conversation.fkUserSender == id ? "user_receiver" : "user_sender";

        const prefixMessage =
          nameUserReceiverProperty == "user_receiver" ? "" : "Você: ";

        const userReceiver = conversation[nameUserReceiverProperty];

        const avatarUserReceiver = userReceiver.avatar
          ? `${baseURL}/images/${userReceiver.avatar}`
          : "../images/user3.png";

        const renderConversation = Mustache.render(templateListConversations, {
          idUserReceiver: userReceiver.id,
          idConversation: fkConversation,
          avatarUserReceiver,
          nameUserReceiver: userReceiver.name,
          message: `${prefixMessage}${message}`,
        });

        document.getElementById("list_peoples").innerHTML += renderConversation;

        document.querySelector(".people_icon").style.borderRadius =
          userReceiver.avatar ? "50%" : "0px";
      }
    );
  } else {
    document.getElementById("list_peoples").innerHTML = "";
  }
}

function talk(idUser) {
  document.getElementById("modalSection").style.top = "-100%";

  const divContainerChat = document.getElementById("chat_container");

  const divLoadingSelectChat = document.getElementById("chat_loading_chat");

  const containerChat = document.getElementById(`containerChat`);

  divLoadingSelectChat.style.display = "none";
  divContainerChat.style.display = "flex";

  containerChat.innerHTML = "";
  document.querySelector(".footerChat").innerHTML = "";

  const user = users.find((userFind) => userFind.id === Number(idUser));

  const templateChatContainer = document.getElementById(
    "template_all_messages"
  ).innerHTML;

  const renderedChatContainer = Mustache.render(templateChatContainer, {
    idUser,
  });

  containerChat.innerHTML += renderedChatContainer;

  const templateFooter = document.getElementById(
    "template_send_message"
  ).innerHTML;

  const rendereFooter = Mustache.render(templateFooter, {
    emailUser: user.email,
    paramsUser: JSON.stringify({
      emailUser: user.email,
      idUser,
    }),
  });

  document.querySelector(".footerChat").innerHTML += rendereFooter;

  const paramsListMessages = {
    fkUser: id,
    fkUserParticipant: user.id,
  };

  socket.emit(
    "list_messages",
    paramsListMessages,
    (messages, lastConversations, messagesStatusPending) => {
      allConversations = lastConversations;
      messagesPending = messagesStatusPending;

      // updateListAllConversations(allConversations);

      if (messages.length > 0) {
        messages.map((item) => {
          if (item.idUserSender === id) {
            listMessagesUsers(item, "template_user_send_message", idUser);
          } else {
            listMessagesUsers(item, "template_user_receiver_message", idUser);
          }
        });
      }
    }
  );
}

function initConversation(fkConversation, idUserReceiver) {
  const idConversation = Number(fkConversation);
  const userReceiverId = Number(idUserReceiver);

  document.getElementById("modalSection").style.top = "-100%";

  const divContainerChat = document.getElementById("chat_container");

  const divLoadingSelectChat = document.getElementById("chat_loading_chat");

  const containerChat = document.getElementById(`containerChat`);

  divLoadingSelectChat.style.display = "none";
  divContainerChat.style.display = "flex";

  containerChat.innerHTML = "";
  document.querySelector(".footerChat").innerHTML = "";

  const userReceiver = users.find((user) => user.id === userReceiverId);

  const templateChatContainer = document.getElementById(
    "template_all_messages"
  ).innerHTML;

  const renderChatContainer = Mustache.render(templateChatContainer, {
    idUserReceiver,
  });

  containerChat.innerHTML += renderChatContainer;

  const templateFooter = document.getElementById(
    "template_send_message"
  ).innerHTML;

  const renderFooter = Mustache.render(templateFooter, {
    emailUserReceiver: userReceiver.email,
    paramsUserReceiver: JSON.stringify({
      emailUserReceiver: userReceiver.email,
      idUserReceiver,
    }),
  });

  document.querySelector(".footerChat").innerHTML += renderFooter;

  const paramsListMessages = {
    fkUser: id,
    fkConversation: idConversation,
  };

  socket.emit("list_new_messages", paramsListMessages, (messages) => {
    console.log("messages ", messages);

    // Validar pela propriedade sendMessage

    /* if (messages.length > 0) {
      messages.forEach(({ conversation, message, createdAt }) => {
        const nameUserProperty =
          conversation.fkUserSender == id ? "user_receiver" : "user_sender";

        const userRender = conversation[nameUserProperty];

        const paramsForRender = {
          message,
          nameUser: userRender.nameUser,
          createdAt,
        };

        if (nameUserProperty === "user_receiver") {
          listMessagesUsers(
            paramsForRender,
            "template_user_receiver_message",
            userReceiverId
          );
        } else {
          listMessagesUsers(
            paramsForRender,
            "template_user_send_message",
            userReceiverId
          );
        }
      });
    } */
  });
}

function sendMessage(paramsUser) {
  const { emailUserReceiver, idUserReceiver } = JSON.parse(paramsUser);

  const text = document.getElementById(`messageUser${emailUserReceiver}`);

  const params = {
    text: text.value,
    emailUserSender: email,
    emailUserReceiver,
    usernameSender: username,
    sendMessage: id,
  };

  // Emissão do novo evento de conversa e mensagem
  socket.emit("user_send_new_message", params, (conversations) => {
    console.log("conversations", conversations);
  });

  const paramsRender = {
    nameUserSender: username,
    message: params.text,
    date: dayjs().format("DD/MM/YY HH:mm:ss"),
  };

  listMessagesUsers(
    paramsRender,
    "template_user_send_message",
    Number(idUserReceiver)
  );

  const containerChat = document.getElementById(`containerChat`);

  containerChat.scrollTo(0, containerChat.scrollHeight);

  text.value = "";
}

async function updateAvatarUser(file) {
  const bodyFormData = new FormData();

  bodyFormData.append("avatar", file);

  const { data } = await axios.patch(`${baseURL}/avatar`, bodyFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  const userUpdated = { ...data, token };

  localStorage.setItem("user", JSON.stringify(userUpdated));

  window.location.reload();
}

async function updateUser(name) {
  const dataUser = {
    name,
  };

  const { data } = await axios.patch(`${baseURL}/user`, dataUser, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const userUpdated = { ...data, token };

  localStorage.setItem("user", JSON.stringify(userUpdated));

  window.location.reload();
}

const loadFilteredListUsers = (listUsers) => {
  const filteredUsers = listUsers.filter((user) => user.email !== email);
  return filteredUsers;
};

function createUsersModal(listUsers) {
  const containerModalBody = document.getElementById("list_users");

  containerModalBody.innerHTML = "";

  listUsers.forEach((user) => {
    const divPeople = document.createElement("div");

    const imgPeople = document.createElement("img");

    const namePeople = document.createElement("p");

    divPeople.id = `user${id}`;
    divPeople.className = "people";

    namePeople.textContent = user.name;
    namePeople.className = "people_text";

    imgPeople.src = user.avatar
      ? `${baseURL}/images/${user.avatar}`
      : "../images/user3.png";

    imgPeople.className = "people_icon";

    divPeople.appendChild(imgPeople);
    divPeople.appendChild(namePeople);

    let conversationUser = null;
    let fkConversation = 1;

    if (allConversations.length > 0) {
      conversationUser = allConversations.find(
        ({ conversation, fkConversation }) => {
          if (
            (conversation.fkUserSender == id &&
              conversation.fkUserReceiver == user.id) ||
            (conversation.fkUserReceiver == id &&
              conversation.fkUserSender == user.id)
          ) {
            return { conversation, fkConversation };
          } else {
            return null;
          }
        }
      );

      fkConversation = conversationUser
        ? conversationUser.fkConversation
        : allConversations[allConversations.length - 1].fkConversation + 1;
    }

    divPeople.addEventListener("click", () => {
      initConversation(fkConversation, user.id);
    });

    containerModalBody.appendChild(divPeople);
  });
}

function backForMain(idSection) {
  document.getElementById(idSection).style.left = "-100vh";
}

async function changePreferences(checked, preference) {
  await axios.patch(
    "http://localhost:3333/user/preferences",
    {
      preference_name: preference,
      preference_value: checked,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const userData = JSON.parse(localStorage.getItem("user"));

  const newUserData = {
    ...userData,
    preferences: {
      ...userData.preferences,
      [preference]: checked,
    },
  };

  localStorage.setItem("user", JSON.stringify(newUserData));
}
