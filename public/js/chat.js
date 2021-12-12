const user = JSON.parse(localStorage.getItem("user"));

const username = user.name;
const email = user.email;
const id = user.id;
const token = user.token;

let socket = null;
let participants = [];

let socket_user = null;

socket = io();

//Participante de chat entrando na sessão
socket.on("acess_chat", (params) => {
  const { username } = params;
  Toastify({
    text: `${username} entrou no chat!`,
    backgroundColor: "linear-gradient(to right, #6d23b6, #47126b)",
    duration: 2000,
  }).showToast();
});

//Emitindo evento de quando entramos no chat para os usuarios
socket.emit("acess_chat_parcipant", { username, email });

//Listando todos os usuarios execeto VC na lista de participantes na pagina
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

//Listando mensagens enviadas e recebidas co participante especifico e sendo renderizado na tela com seu container html especifico
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

//Função para renderizar as mensagens daquele participante especifico e poder conversar com ele
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

//Função para mandar mensagem para o participante especifico
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

//Evento de escuta de quando recebe mensagem e renderiza a mensagem no container html do usuario ativo
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

//Click para ir até a rota de perfil
document.getElementById("profile").addEventListener("click", () => {
  window.location = "/profile";
});

//Função de deslogar do sistema
document.getElementById("logout").addEventListener("click", () => {
  document.getElementById("chat_loading_chat").style.display = "flex";
  document.getElementById("chat_container").style.display = "none";

  socket.emit("logout_parcipant", id);

  localStorage.clear();

  window.location = "/index";
});

//Função de pesquisa de participante PRECISA SER REFEITA COM MUSTACHE
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
