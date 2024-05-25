async function registerNickName() {
  const nicknameValue = document.getElementById("new_nickname_input").value;

  if (!nicknameValue) {
    Toastify({
      text: "Informe um nome de usuário válido!",
      backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
      duration: 2000,
    }).showToast();

    return;
  }

  if (nicknameValue.length < 4) {
    Toastify({
      text: "Informe um nome de usuário com mais de 3 caracteres!",
      backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
      duration: 2000,
    }).showToast();

    return;
  }

  if (/\p{Extended_Pictographic}/u.test(nicknameValue)) {
    Toastify({
      text: "Nome de usuário não pode conter emojis!",
      backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
      duration: 2000,
    }).showToast();

    return;
  }

  try {
    await axios.patch(
      `${baseURL}/user`,
      {
        nickname: nicknameValue,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Toastify({
      text: "Nome de usuario cadastrado com sucesso",
      backgroundColor: "linear-gradient(to right, #2ecc71, #27ae60)",
      duration: 2000,
    }).showToast();

    document.getElementById("modalNickName").style.top = "-100%";
  } catch (error) {
    if (error.response.status === 400) {
      Toastify({
        text: "Nome de usuário já cadastrado!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();
      return;
    } else {
      Toastify({
        text: "Erro ao realizar cadastro do nome do usuário, tente novamente!",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
        duration: 2000,
      }).showToast();
      return;
    }
  }
}
