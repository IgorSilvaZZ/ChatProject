let socket = null;
socket = io();

async function handleSubmit() {
  const userData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
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

document.getElementById("btnSubmit").addEventListener("click", handleSubmit);
