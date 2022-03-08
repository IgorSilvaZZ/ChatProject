let socket = null;
socket = io();

document.getElementById("btnSubmit").addEventListener("click", () => {
  fetch("http://localhost:3333/createUser", {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    }),
  }).then((res) => {
    if (res.status === 201) {
      Toastify({
        text: "Cadastro realizado com sucesso",
        backgroundColor: "linear-gradient(to right, #2ecc71, #27ae60)",
        duration: 2000,
      }).showToast();

      socket.emit("update_user");

      setTimeout(() => {
        window.location = "/";
      }, 2000);
    }
    if (res.status === 400) {
      Toastify({
        text: "Usuario já existe!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();
    }
  });
});
