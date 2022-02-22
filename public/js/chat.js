const userLoged = JSON.parse(localStorage.getItem("user"));

const username = userLoged.name;
const email = userLoged.email;
const id = userLoged.id;
const token = userLoged.token;

let socket = null;
let users = [];
let allConversations = [];

socket = io();

let socket_user = null;

const listMessagesUsers = (params, templateName, idUser) => {
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
};

const openModal = () => {
  document.getElementById("modalSection").style.top = "0";
  let template = document.getElementById("template_users").innerHTML;

  users.forEach((user) => {
    const renderedUsers = Mustache.render(template, {
      idUser: user.id,
      nameUser: user.name,
    });

    document.getElementById("list_users").innerHTML += renderedUsers;
  });
};

const openModalUpdateAvatar = () => {
  document.getElementById("modalUpdateSection").style.top = "0";

  document.querySelector(".modal").style.height = "30%";
};

const talk = (idUser) => {
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
};

const sendMessage = (paramsUser) => {
  const { emailUser, idUser } = JSON.parse(paramsUser);

  const text = document.getElementById(`messageUser${emailUser}`);

  const params = {
    text: text.value,
    emailUserSender: email,
    emailUserReceiver: emailUser,
    usernameSender: username,
  };

  socket.emit("user_send_message", params, (conversations) => {
    console.log(conversations);
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
};

socket.emit("list_all_users", { email }, (listUsers) => {
  users = listUsers;
});

//Emitindo evento de quando entramos no chat para os usuarios
socket.emit(
  "access_chat",
  { username, email },
  (lastConversations, messagesStatusPending) => {
    if (lastConversations.length > 0) {
      document.getElementById("notFoundMessages").style.display = "none";

      lastConversations.forEach((user) => {
        var dupicated =
          allConversations.findIndex((item) => {
            return user.id == item.id;
          }) > -1;

        if (!dupicated) {
          allConversations.push(user);
        }
      });

      let templateListConversations = document.getElementById(
        "template_conversations"
      ).innerHTML;

      allConversations.forEach((user) => {
        const renderedConversations = Mustache.render(
          templateListConversations,
          {
            idUser: user.id,
            nameUser: user.name,
          }
        );

        document.getElementById("list_conversations").innerHTML +=
          renderedConversations;
      });
    }
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

  listMessagesUsers(
    paramsRender,
    "template_user_receiver_message",
    Number(idUser)
  );
});

document.querySelector(".open_modal").addEventListener("click", openModal);
document
  .getElementById("imageUser")
  .addEventListener("click", openModalUpdateAvatar);

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("template_users").innerHTML = "";
  document.getElementById("modalSection").style.top = "-100%";
});

document.getElementById("logoutButton").addEventListener("click", () => {
  socket.emit("logout_user", id);

  localStorage.clear();

  window.location = "/";
});
