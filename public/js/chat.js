const userLoged = JSON.parse(localStorage.getItem("user"));

const username = userLoged.name;
const email = userLoged.email;
const id = userLoged.id;
const token = userLoged.token;
const avatar = userLoged.avatar;

let socket = null;
let users = [];
let allConversations = [];
const baseURL = "http://localhost:3333";

socket = io();

let socket_user = null;

/* ======= FUNÇÕES USADA NO RESTANTE DO CODIGO ======== */

function listMessagesUsers(params, templateName, idUser) {
  const containerChat = document.getElementById(`containerChat`);

  const chatContainer = document.getElementById(`chatContainer${idUser}`);

  const template = document.getElementById(templateName).innerHTML;

  const rendered = Mustache.render(template, {
    name: params.nameUserSender,
    message: params.message,
    date: dayjs(params.createdAt).format("DD/MM/YY HH:mm:ss"),
  });

  chatContainer.innerHTML += rendered;

  containerChat.scrollTo(0, containerChat.scrollHeight);
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
      const renderedConversations = Mustache.render(templateListConversations, {
        idUser: item.user_receiver.id,
        nameUser: item.user_receiver.name,
        avatarUser: item.user_receiver.avatar
          ? `${baseURL}/images/${item.user_receiver.avatar}`
          : "../images/user3.png",
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

  socket.emit("list_messages", paramsListMessages, (messages) => {
    if (messages.length > 0) {
      messages.map((item) => {
        if (item.idUserSender === id) {
          listMessagesUsers(item, "template_user_send_message", idUser);
        } else {
          listMessagesUsers(item, "template_user_receiver_message", idUser);
        }
      });
    }
  });
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

/* =========================== */

/* ======= EMISSÃO/ESCUTA DE EVENTOS ======== */

socket.emit("list_all_users", null, (listUsers) => {
  users = loadFilteredListUsers(listUsers);
});

//Emitindo evento de quando entramos no chat para os usuarios
socket.emit(
  "access_chat",
  { username, email },
  (messagesStatusPending, lastConversations) => {
    allConversations = lastConversations;
    updateListAllConversations(lastConversations);
    if (messagesStatusPending.length > 0) {
      messagesStatusPending.map((messageUser) => {
        Toastify({
          text: `${messageUser.user_sender.name} enviou uma mensagem, enquanto estava offline!`,
          backgroundColor: "#5f27cd",
          duration: 2000,
          onClick: () => talk(messageUser.user_sender.id),
        }).showToast();
      });
    }
  }
);

socket.on("user_receiver_message", (params) => {
  const { text, usernameSender, idUser } = params;

  Toastify({
    text: `${usernameSender} mandou uma mensagem pra você!`,
    backgroundColor: "linear-gradient(to right, #6d23b6, #47126b)",
    duration: 2000,
    onClick: () => talk(idUser),
  }).showToast();

  const paramsRender = {
    name: usernameSender,
    message: text,
    date: dayjs().format("DD/MM/YY HH:mm:ss"),
  };

  socket.emit(
    "list_last_conversations",
    { fkUserSender: id },
    (lastConversations) => {
      allConversations = lastConversations;
      updateListAllConversations(lastConversations);
    }
  );

  listMessagesUsers(
    paramsRender,
    "template_user_receiver_message",
    Number(idUser)
  );
});

socket.on("update_list_users", (listUsers) => {
  users = loadFilteredListUsers(listUsers);

  createUsersModal(users);
});

/* =========================== */

/* ======= ACESSO AO DOM ======== */

let inputProfileName = document.getElementById("input-profile-name");

document.querySelector(".open_modal").addEventListener("click", openModal);

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("modalSection").style.top = "-100%";
});

// Pesquisa de conversa na input
document.getElementById("searchValue").addEventListener("keyup", (event) => {
  const nameUser = event.target.value;

  if (nameUser === "") {
    updateListAllConversations(allConversations);
    return;
  }

  const conversationsSearch = allConversations.filter(
    ({ user_receiver: { name } }) => name.includes(nameUser)
  );

  updateListAllConversations(conversationsSearch);
});

document.getElementById("imageUser").addEventListener("click", () => {
  document.getElementById("section-profile").style.left = "0";

  inputProfileName.value = username;
});

document.getElementById("configButton").addEventListener("click", () => {
  document.getElementById("section-config").style.left = "0";
});

document.getElementById("logoutButton").addEventListener("click", () => {
  socket.emit("logout_user", id);

  localStorage.clear();

  window.location = "/";
});

inputProfileName.addEventListener("blur", () => {
  document.getElementById("image-profile-edit").src = "../images/edit.png";
});

inputProfileName.addEventListener("focus", () => {
  const imageChecked = document.getElementById("image-profile-edit");

  imageChecked.src = "../images/check.png";

  imageChecked.addEventListener("click", () => {
    const name = inputProfileName.value;

    updateUser(name);
  });
});

document
  .getElementById("file-input")
  .addEventListener("change", ({ target }) => {
    const file = target.files[target.files.length - 1];

    updateAvatarUser(file);
  });

/* =========================== */

/* ======= ENTRADA NA PAGINA ======== */
let image = document.getElementById("imageUser");

let imageProfile = document.getElementById("imageUserProfile");

image.src = avatar ? `${baseURL}/images/${avatar}` : "../images/user3.png";

image.style.borderRadius = avatar ? "50%" : "0px";

imageProfile.src = avatar
  ? `${baseURL}/images/${avatar}`
  : "../images/user3.png";

imageProfile.style.borderRadius = avatar ? "50%" : "0px";

/* =========================== */
