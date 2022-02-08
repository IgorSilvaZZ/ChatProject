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
  const containerChat = document.getElementById(`chatContainer${idUser}`);

  const template = document.getElementById(templateName).innerHTML;

  const rendered = Mustache.render(template, {
    name: params.nameUserSender,
    message: params.message,
    date: dayjs(params.createdAt).format("DD/MM/YY HH:mm:ss"),
  });

  containerChat.innerHTML += rendered;
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

      allConversations = lastConversations;

      let templateListConversations = document.getElementById(
        "template_conversations"
      ).innerHTML;

      lastConversations.forEach((user) => {
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

document.querySelector(".open_modal").addEventListener("click", openModal);

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("modalSection").style.top = "-100%";
});

const talk = (idUser) => {
  document.getElementById("modalSection").style.top = "-100%";

  const divContainerChat = document.getElementById("chat_container");

  const divLoadingSelectChat = document.getElementById("chat_loading_chat");

  divLoadingSelectChat.style.display = "none";
  divContainerChat.style.display = "flex";

  document.getElementById("containerChat").innerHTML = "";
  document.querySelector(".footerChat").innerHTML = "";

  const user = users.find((userFind) => userFind.id === Number(idUser));

  const templateChatContainer = document.getElementById(
    "template_all_messages"
  ).innerHTML;

  const renderedChatContainer = Mustache.render(templateChatContainer, {
    idUser,
  });

  document.getElementById("containerChat").innerHTML += renderedChatContainer;

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

  text.value = "";
};
