function registerNickName() {
  const nicknameValue = document.getElementById("new_nickname_input").value;

  if (!nicknameValue) {
    Toastify({
      text: "Informe um nome de usuario válido!",
      backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
      duration: 2000,
    }).showToast();
  }

  console.log(nicknameValue);
}
