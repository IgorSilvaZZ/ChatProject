const username = JSON.parse(localStorage.getItem('username'));
const email = JSON.parse(localStorage.getItem('email'));
const id = JSON.parse(localStorage.getItem('id'));
const token = JSON.parse(localStorage.getItem('token'));

let socket = null;
let participants = [];

let socket_user = null

socket = io();

socket.on('acess_chat', (params) => {

    Toastify({
        text: `${params.username} entrou no chat!`,
        backgroundColor: "linear-gradient(to right, #6d23b6, #47126b)",
        duration: 2000,
    }).showToast();

});

socket.emit('acess_chat_parcipant', { username , email });

socket.on('participants_list_all', connections => {

    const newParticipants = connections.filter(participant => participant.name !== username && participant.socket_id !== null);

    const informationUser = connections.filter(participant => participant.name == username);

    socket_user = localStorage.setItem('user_socket', JSON.stringify(informationUser[0].socket_id));

    participants = newParticipants;

    const listDivPeople = document.querySelector('.listPeoples');
    listDivPeople.innerHTML = "";

    const divLoadingSelectChat = document.getElementById('chat_loading_chat');

    const divContainerChat = document.getElementById('chat_container');

    participants.map(participant => {

        const divPeople = document.createElement('div');
        divPeople.className = "people";

        const divImagePeople = document.createElement('div');
        divImagePeople.className = "peopleImage"

        const imagePeople = document.createElement('img');
        imagePeople.src = "../images/user3.png";

        divImagePeople.append(imagePeople);

        const informationPeople = document.createElement('div');
        informationPeople.className = "peopleInformations";

        const namePeople = document.createElement('p');
        namePeople.innerHTML = participant.name;

        informationPeople.append(namePeople);

        divPeople.append(divImagePeople);
        divPeople.append(informationPeople);

        let socket_id = participant.socket_id;

        divPeople.addEventListener('click', () => {

            divLoadingSelectChat.style.display = "none";
            divContainerChat.style.display = "flex";
            document.getElementById('containerChat').innerHTML = "";
            localStorage.setItem('user_sender', JSON.stringify(socket_id));

        })

        listDivPeople.append(divPeople);

    });
})

document.getElementById('buttonSubmitMessage').addEventListener('click', () => {

    const containerChat = document.getElementById('containerChat');

    const text = document.getElementById('messageUser');

    const socket_id = JSON.parse(localStorage.getItem('user_sender'));
    const socket_user_send = JSON.parse(localStorage.getItem('user_socket'));

    const params = {
        text: text.value,
        socket_id,
        socket_user_send,
        username_message: username,
    }

    socket.emit('user_send_message', params);

    const divMessageUser = document.createElement('div');
    divMessageUser.className = "messageUserLoged";

    const containerMessage = document.createElement('div');
    containerMessage.className = "containerMessage userLoged";
    containerMessage.innerHTML += `<span class="usernameLoged">${username}</span>`
    containerMessage.innerHTML += `<span class="messageBox">${params.text}</span>`
    containerMessage.innerHTML += `<span class='date_message'>${dayjs().format("DD/MM/YY HH:mm:ss")}</span>`; 

    divMessageUser.appendChild(containerMessage);
    containerChat.appendChild(divMessageUser);

    text.value = "";

})

socket.on('user_receiver_message', message => {

    document.getElementById('chat_loading_chat').style.display = "none"
    document.getElementById('chat_container').style.display = "flex";

    const { text, socket_user_send, username_message } = message;

    localStorage.setItem('user_sender', JSON.stringify(socket_user_send));

    Toastify({
        text: `${username_message} mandou uma mensagem pra você!`,
        backgroundColor: "linear-gradient(to right, #6d23b6, #47126b)",
        duration: 2000,
    }).showToast();

    const divMessageUser = document.createElement('div');
    divMessageUser.className = "messageOtherUser";

    const containerMessage = document.createElement('div');
    containerMessage.className = "containerMessage otherUser";
    containerMessage.innerHTML += `<span class="usernameLoged">${username_message}</span>`
    containerMessage.innerHTML += `<span class="messageBox">${text}</span>`
    containerMessage.innerHTML += `<span class='date_message'>${dayjs().format("DD/MM/YY HH:mm:ss")}</span>`; 

    divMessageUser.appendChild(containerMessage);
    containerChat.appendChild(divMessageUser);

})

document.getElementById('logout').addEventListener('click', () => {

    document.getElementById('chat_loading_chat').style.display = "flex"
    document.getElementById('chat_container').style.display = "none";

    socket.emit('logout_parcipant', id);

    localStorage.clear();
    
    window.location = "/index";
});


window.addEventListener('load', () => {

    if(!token || !username){
        window.location = "/index";
    }
})