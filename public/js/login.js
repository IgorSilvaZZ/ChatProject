const baseURL = "http://localhost:3333";

let socket = null;
socket = io();

async function handleLogin() {
  const dataUser = {
    email: document.getElementById("email_input").value,
    password: document.getElementById("password_input").value,
  };

  try {
    if (dataUser.email === "") {
      Toastify({
        text: "Digite um email para continuar!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();

      return;
    }

    if (dataUser.password === "") {
      Toastify({
        text: "Digite uma senha para continuar!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();

      return userIsValid;
    }

    const { data } = await axios.post(`${baseURL}/authenticate`, dataUser);

    const user = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      token: data.token,
      avatar: data.user.avatar,
      preferences: {
        notification_preference: data.preferences.notification_preference,
        sound_preference: data.preferences.sound_preference,
      },
    };

    localStorage.setItem("user", JSON.stringify(user));

    Toastify({
      text: "Login efetuado com Sucesso",
      backgroundColor: "linear-gradient(to right, #2ecc71, #27ae60)",
      duration: 2000,
    }).showToast();

    setTimeout(() => {
      window.location = "/chat";
    }, 2000);
  } catch (error) {
    if (error.response.status === 400) {
      Toastify({
        text: "Usuario ou Senha incorretos!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();
      return;
    } else {
      Toastify({
        text: "Erro ao realizar login, tente novamente!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();
    }
  }
}

document
  .getElementById("register_link")
  .addEventListener("click", () => (window.location = "/register"));

document.getElementById("btnSubmit").addEventListener("click", handleLogin);
