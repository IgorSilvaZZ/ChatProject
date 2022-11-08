const userLogged = JSON.parse(localStorage.getItem("user"));

const baseURL = "http://localhost:3333";

const { name: username, email, id, token, avatar } = userLogged;

const preferencesUser = {
  notification_preference: false,
  sound_preference: false,
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
  (messagesStatusPending, lastConversations) => {
    allConversations = lastConversations;
    messagesPending = messagesStatusPending;

    updateListAllConversations(lastConversations);
  }
);

socket.emit("list_preferences", { user_id: id }, (preferences) => {
  for (property in preferences) {
    if (["notification_preference", "sound_preference"].includes(property)) {
      preferencesUser[property] = preferences[property];
    }
  }
});

socket.on("user_receiver_message", (params) => {
  const { text, usernameSender, idUser } = params;

  const { notification_preference, sound_preference } = preferencesUser;

  if (sound_preference === true) {
    let sound = new Howl({
      src: ["../sound/notification_sound.mp3"],
      volume: 0.5,
    });

    sound.play();
  }

  if (notification_preference === true) {
    Toastify({
      text: `${usernameSender} mandou uma mensagem pra você!`,
      backgroundColor: "linear-gradient(to right, #6d23b6, #47126b)",
      duration: 2000,
      onClick: () => talk(idUser),
    }).showToast();
  }

  const paramsRender = {
    name: usernameSender,
    message: text,
    date: dayjs().format("DD/MM/YY HH:mm:ss"),
  };

  socket.emit(
    "list_last_conversations",
    { fkUserSender: id },
    (lastConversations, messagesStatusPending) => {
      allConversations = lastConversations;
      messagesPending = messagesStatusPending;

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
