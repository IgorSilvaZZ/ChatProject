const userLoged = JSON.parse(localStorage.getItem("user"));
const baseURL = "http://localhost:3333";

const { name: username, email, id, token, avatar } = userLoged;

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

/* Acesso ao DOM diretamente */

let inputProfileName = document.getElementById("input-profile-name");

document.querySelector(".open_modal").addEventListener("click", () => {
  document.getElementById("modalSection").style.top = "0";

  createUsersModal(users);
});

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

  for (property in preferencesUser) {
    document.getElementById(property).checked = preferencesUser[property];
  }
});

document.getElementById("logoutButton").addEventListener("click", () => {
  socket.emit("logout_user", id);

  localStorage.clear();

  window.location = "/";
});

document
  .getElementById("notification_preference")
  .addEventListener("change", (e) => {
    const checked = e.target.checked;

    changePreferences(checked, "notification_preference");
  });

document.getElementById("sound_preference").addEventListener("change", (e) => {
  const checked = e.target.checked;

  changePreferences(checked, "sound_preference");
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
