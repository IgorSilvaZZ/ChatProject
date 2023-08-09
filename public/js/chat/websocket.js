const userLogged = JSON.parse(localStorage.getItem("user"));

const baseURL = "http://localhost:3333";

const { name: username, email, id, token, avatar, preferences } = userLogged;

const preferencesUser = {
  notification_preference: preferences.notification_preference,
  sound_preference: preferences.sound_preference,
};

let socket = null;
let users = [];
let allConversations = [];
let messagesPending = [];

socket = io();

/* ======= EMISSÃO/ESCUTA DE EVENTOS ======== */

socket.emit("list_all_users", null, (listUsers) => {
  users = loadFilteredListUsers(listUsers);
});

//Emitindo evento de quando entramos no chat para os usuarios
socket.emit(
  "access_chat",
  { username, email },
  (messagesStatusPending, lastMessagesConversations) => {
    messagesPending = messagesStatusPending;
    allConversations = lastMessagesConversations;

    updateListAllConversations(lastMessagesConversations);
  }
);

socket.on("user_receiver_new_message", (params) => {
  const { text, usernameSender, idUser } = params;

  const { preferences } = JSON.parse(localStorage.getItem("user"));

  if (preferences.sound_preference === true) {
    let sound = new Howl({
      src: ["../sound/notification_sound.mp3"],
      volume: 0.5,
    });

    sound.play();
  }

  if (preferences.notification_preference === true) {
    Toastify({
      text: `${usernameSender} mandou uma mensagem pra você!`,
      backgroundColor: "linear-gradient(to right, #6d23b6, #47126b)",
      duration: 2000,
      onClick: () => talk(idUser),
    }).showToast();
  }

  const paramsRender = {
    nameUserSender: usernameSender,
    message: text,
    date: dayjs().format("DD/MM/YY HH:mm:ss"),
  };

  socket.emit(
    "list_user_new_conversations",
    { fkUser: id },
    (lastMessagesConversations) => {
      updateListAllConversations(lastMessagesConversations);
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
