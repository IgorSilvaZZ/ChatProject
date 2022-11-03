const userLoged = JSON.parse(localStorage.getItem("user"));

const { name: username, email, id, token, avatar } = userLoged;
const baseURL = "http://localhost:3333";
const preferencesUser = {
  notification_preference: false,
  sound_preference: false,
};

let socket = null;
let users = [];
let allConversations = [];
let messagesPending = [];


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

/* =========================== */
