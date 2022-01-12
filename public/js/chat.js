const user = JSON.parse(localStorage.getItem("user"));

const username = user.name;
const email = user.email;
const id = user.id;
const token = user.token;

let socket = null;
let users = [];

socket = io();

let socket_user = null;

const openModal = () => {
  socket.emit("list_all_users", { email }, (usersSocket) => {
    document.getElementById("modalSection").style.top = "0";

    users = usersSocket;

    let template = document.getElementById("template_users").innerHTML;

    console.log(template);

    usersSocket.forEach((user) => {
      const renderedUsers = Mustache.render(template, {
        idUser: user.id,
        nameUser: user.name,
      });

      document.getElementById("list_users").innerHTML += renderedUsers;
    });
  });
};

//Emitindo evento de quando entramos no chat para os usuarios
socket.emit("access_chat", { username, email });

document.querySelector(".open_modal").addEventListener("click", openModal);

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("modalSection").style.top = "-100%";
});
