/* ======= FUNÇÕES USADA NO RESTANTE DO CODIGO ======== */

function listMessagesUsers(params, templateName, idUser) {
  const containerChat = document.getElementById(`containerChat`);

  const chatContainer = document.getElementById(`chatContainer${idUser}`);

  if (chatContainer) {
    const template = document.getElementById(templateName).innerHTML;

    const rendered = Mustache.render(template, {
      name: params.nameUserSender,
      message: params.message,
      date: dayjs(params.createdAt).format("DD/MM/YY HH:mm:ss"),
    });

    chatContainer.innerHTML += rendered;

    containerChat.scrollTo(0, containerChat.scrollHeight);
  }
}

function openModal() {
  document.getElementById("modalSection").style.top = "0";

  createUsersModal(users);
}

function updateListAllConversations(lastConversations) {
  if (lastConversations.length > 0) {
    if (document.getElementById("notFoundMessages")) {
      document.getElementById("notFoundMessages").style.display = "none";
    }

    document.getElementById("list_peoples").innerHTML = "";

    let templateListConversations = document.getElementById(
      "template_conversations"
    ).innerHTML;

    lastConversations.forEach((item) => {
      const quantityMessages = messagesPending.filter(
        (message) => message.fkUserSender === item.fkUserReceiver
      ).length;

      const renderedConversations = Mustache.render(templateListConversations, {
        idUser: item.user_receiver.id,
        nameUser: item.user_receiver.name,
        avatarUser: item.user_receiver.avatar
          ? `${baseURL}/images/${item.user_receiver.avatar}`
          : "../images/user3.png",
        quantityMessages,
      });

      document.getElementById("list_peoples").innerHTML +=
        renderedConversations;

      document.querySelector(".people_icon").style.borderRadius = item
        .user_receiver.avatar
        ? "50%"
        : "0px";
    });
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

      updateListAllConversations(allConversations);

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

function sendMessage(paramsUser) {
  const { emailUser, idUser } = JSON.parse(paramsUser);

  const text = document.getElementById(`messageUser${emailUser}`);

  const params = {
    text: text.value,
    emailUserSender: email,
    emailUserReceiver: emailUser,
    usernameSender: username,
  };

  socket.emit("user_send_message", params, (lastConversations) => {
    allConversations = lastConversations;
    updateListAllConversations(lastConversations);
  });

  const paramsRender = {
    nameUserSender: username,
    message: params.text,
    date: dayjs().format("DD/MM/YY HH:mm:ss"),
  };

  listMessagesUsers(paramsRender, "template_user_send_message", Number(idUser));

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

    divPeople.addEventListener("click", () => {
      talk(user.id);
    });

    containerModalBody.appendChild(divPeople);
  });
}

function backForMain(idSection) {
  document.getElementById(idSection).style.left = "-100vh";
}

function changePreferences(checked, preference) {
  const preferenceValue = checked;

  socket.emit("change_preference", {
    user_id: id,
    preference,
    preferenceValue,
  });
}

/* =========================== */
