let socket = null;
socket = io();

async function handleSubmit() {
  const userData = {
    name: document.getElementById("name_input").value,
    email: document.getElementById("email_input").value,
    password: document.getElementById("password_input").value,
  };

  try {
    if (
      userData.name === "" ||
      (userData.name.length < 3 && userData.name.length > 100)
    ) {
      Toastify({
        text: "Insira um nome valido!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();

      return;
    }

    if (userData.email === "") {
      Toastify({
        text: "Email é obrigatorio!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();

      return;
    }

    if (
      userData.password === "" ||
      (userData.password.length < 3 && userData.password.length > 50)
    ) {
      Toastify({
        text: "Insira uma senha valida!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();

      return;
    }

    const { data } = await axios.post(
      "http://localhost:3333/createUser",
      userData
    );

    Toastify({
      text: "Cadastro realizado com sucesso",
      backgroundColor: "linear-gradient(to right, #2ecc71, #27ae60)",
      duration: 2000,
    }).showToast();

    const params = {
      ...data,
      new_user: true,
    };

    socket.emit("update_users", params);

    setTimeout(() => {
      window.location = "/";
    }, 2000);
  } catch (error) {
    if (error.response.status === 400) {
      Toastify({
        text: "Usuario já existe!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();
      return;
    } else {
      Toastify({
        text: "Erro ao realizar cadastro, tente novamente!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();
      return;
    }
  }
}

document
  .getElementById("login_link")
  .addEventListener("click", () => (window.location = "/"));

document.getElementById("btnSubmit").addEventListener("click", handleSubmit);
