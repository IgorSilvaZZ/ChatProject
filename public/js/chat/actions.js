/* ======= ENTRADA NA PAGINA ======== */

window.addEventListener("load", () => {
  let image = document.getElementById("imageUser");

  let imageProfile = document.getElementById("imageUserProfile");

  image.src = avatar ? `${baseURL}/images/${avatar}` : "../images/user3.png";

  image.style.borderRadius = avatar ? "50%" : "0px";

  imageProfile.src = avatar
    ? `${baseURL}/images/${avatar}`
    : "../images/user3.png";

  imageProfile.style.borderRadius = avatar ? "50%" : "0px";
});

/* Actions diretamente na DOM */

let inputProfileName = document.getElementById("input-profile-name");

document.querySelector(".open_modal").addEventListener("click", () => {
  document.getElementById("modalSection").style.top = "0";

  createUsersModal(users);
});

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("modalSection").style.top = "-100%";
});

// Pesquisa de conversa na input
// Refatorar parte de pesquisa com novo paradigma de conversa
document.getElementById("searchValue").addEventListener("keyup", (event) => {
  const nameUser = event.target.value;

  if (nameUser === "") {
    updateListAllConversations(allConversations);
    return;
  }

  const conversationsSearch = allConversations.filter(({ conversation }) => {
    let userReceiver =
      conversation.user_sender.id === id
        ? { ...conversation.user_receiver }
        : { ...conversation.user_sender };

    if (String(userReceiver.name).includes(nameUser)) {
      return {
        userReceiver,
      };
    }
  });

  updateListAllConversations(conversationsSearch);
});

document.getElementById("imageUser").addEventListener("click", () => {
  document.getElementById("section-profile").style.left = "0";

  inputProfileName.value = username;
});

document.getElementById("configButton").addEventListener("click", () => {
  document.getElementById("section-config").style.left = "0";

  const { preferences } = JSON.parse(localStorage.getItem("user"));

  for (preference in preferences) {
    document.getElementById(preference).checked = preferences[preference];
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
