const username = JSON.parse(localStorage.getItem("username"));
const email = JSON.parse(localStorage.getItem("email"));
const id = JSON.parse(localStorage.getItem("id"));
const token = JSON.parse(localStorage.getItem("token"));

let socket = null;
let participants = [];

let socket_user = null;
let socket_user_receiver = null;

socket = io();

socket.on("acess_chat", (params) => {
  Toastify({
    text: `${params.username} entrou no chat!`,
    backgroundColor: "linear-gradient(to right, #6d23b6, #47126b)",
    duration: 2000,
  }).showToast();
});

socket.emit("acess_chat_parcipant", { username, email });

socket.on("participants_list_all", (connections) => {
  const newParticipants = connections.filter(
    (participant) =>
      participant.name !== username && participant.socket_id !== null
  );

  const informationUser = connections.filter(
    (participant) => participant.name == username
  );

  socket_user = informationUser[0].socket_id;

  participants = newParticipants;

  document.getElementById("list_participants").innerHTML = "";

  let template = document.getElementById("template_participants").innerHTML;

  participants.forEach((participant) => {
    const rendered = Mustache.render(template, {
      idSocketParticipant: participant.socket_id,
      nameParticipant: participant.name,
    });

    document.getElementById("list_participants").innerHTML += rendered;
  });
});

const listMessagesUsersSender = (params, templateName, idSocketParticipant) => {
  const containerChat = document.getElementById(
    `chatContainer${idSocketParticipant}`
  );

  const template = document.getElementById(templateName).innerHTML;

  const rendered = Mustache.render(template, {
    name: params.nameUserSender,
    message: params.message,
    date: dayjs(params.createdAt).format("DD/MM/YY HH:mm:ss"),
  });

  containerChat.innerHTML += rendered;
};

const talk = (idSocketParticipant) => {
  const divContainerChat = document.getElementById("chat_container");

  const divLoadingSelectChat = document.getElementById("chat_loading_chat");

  divLoadingSelectChat.style.display = "none";
  divContainerChat.style.display = "flex";

  document.getElementById("containerChat").innerHTML = "";
  document.querySelector(".footerChat").innerHTML = "";

  const connection = participants.find(
    (participant) => participant.socket_id === idSocketParticipant
  );

  const templateChatContainer = document.getElementById(
    "template_all_messages"
  ).innerHTML;

  const renderedChatContainer = Mustache.render(templateChatContainer, {
    idSocketParticipant,
  });

  document.getElementById("containerChat").innerHTML += renderedChatContainer;

  const template = document.getElementById("template_send_message").innerHTML;

  const rendered = Mustache.render(template, {
    idUserSocket: connection.socket_id,
  });

  document.querySelector(".footerChat").innerHTML += rendered;

  const params = {
    fkUser: id,
    fkUserParticipant: connection.user_id,
  };

  socket.emit("list_messages", params, (messages) => {
    messages.map((item) => {
      if (item.idUserSender === id) {
        listMessagesUsersSender(
          item,
          "template_user_send_message",
          idSocketParticipant
        );
      } else {
        listMessagesUsersSender(
          item,
          "template_user_receiver_message",
          idSocketParticipant
        );
      }
    });
  });
};

const sendMessage = (id) => {
  const text = document.getElementById(`messageUser${id}`);

  const params = {
    text: text.value,
    socket_user,
    socket_user_receiver: id,
    username_message: username,
  };

  socket.emit("user_send_message", params);

  const paramsRender = {
    name: username,
    message: params.text,
    date: dayjs().format("DD/MM/YY HH:mm:ss"),
  };

  listMessagesUsersSender(paramsRender, "template_user_send_message", id);

  text.value = "";
};

socket.on("user_receiver_message", (message) => {
  const { text, username_message, idUserSender } = message;

  Toastify({
    text: `${username_message} mandou uma mensagem pra você!`,
    backgroundColor: "linear-gradient(to right, #6d23b6, #47126b)",
    duration: 2000,
  }).showToast();

  const paramsRender = {
    name: username_message,
    message: text,
    date: dayjs().format("DD/MM/YY HH:mm:ss"),
  };

  listMessagesUsersSender(
    paramsRender,
    "template_user_receiver_message",
    idUserSender
  );
});

document.getElementById("profile").addEventListener("click", () => {
  window.location = "/profile";
});

document.getElementById("logout").addEventListener("click", () => {
  document.getElementById("chat_loading_chat").style.display = "flex";
  document.getElementById("chat_container").style.display = "none";

  socket.emit("logout_parcipant", id);

  localStorage.clear();

  window.location = "/index";
});

document.getElementById("searchValue").addEventListener("keyup", (event) => {
  const nameParticipant = event.currentTarget.value;

  const participantSearch = participants.filter((participant) =>
    participant.name.includes(nameParticipant)
  );

  /* const listDivPeople = document.querySelector(".listPeoples");
  listDivPeople.innerHTML = "";

  if (participantSearch.length > 0) {
    listPeoples(participantSearch);
  }

  if (nameParticipant === "") {
    listPeoples(participants);
  } */
});

window.addEventListener("load", () => {
  if (!token || !username) {
    window.location = "/index";
  }
});
