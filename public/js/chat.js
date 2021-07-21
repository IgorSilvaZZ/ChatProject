const username = JSON.parse(localStorage.getItem('username'));
const email = JSON.parse(localStorage.getItem('email'));
const id = JSON.parse(localStorage.getItem('id'));
const token = JSON.parse(localStorage.getItem('token'));

let socket = null;
let participants = [];

let socket_user = null
let socket_user_receiver = null;

socket = io();

socket.on('acess_chat', (params) => {

    Toastify({
        text: `${params.username} entrou no chat!`,
        backgroundColor: "linear-gradient(to right, #6d23b6, #47126b)",
        duration: 2000,
    }).showToast();

});

socket.emit('acess_chat_parcipant', { username , email });

const listMessages = (params) => {

    socket.emit('list_messages', params, messages => {

        const containerChat = document.getElementById('containerChat');

        console.log(messages);

        messages.map(item => {

            const divMessageUser = document.createElement('div');

            if(item.idUserSender === id){

                divMessageUser.className = "messageUserLoged";

                const containerMessage = document.createElement('div');
                containerMessage.className = "containerMessage userLoged";
                containerMessage.innerHTML += `<span class="usernameLoged">${item.nameUserSender}</span>`
                containerMessage.innerHTML += `<span class="messageBox">${item.message}</span>`
                containerMessage.innerHTML += `<span class='date_message'>${item.createdAt}</span>`; 

                divMessageUser.appendChild(containerMessage);
            }else{

                
                divMessageUser.className = "messageOtherUser";

                const containerMessage = document.createElement('div');
                containerMessage.className = "containerMessage otherUser";
                containerMessage.innerHTML += `<span class="usernameLoged">${item.nameUserSender}</span>`
                containerMessage.innerHTML += `<span class="messageBox">${item.message}</span>`
                containerMessage.innerHTML += `<span class='date_message'>${item.createdAt}</span>`; 

                divMessageUser.appendChild(containerMessage);

            }

            containerChat.appendChild(divMessageUser);

        })

       /*  messages.messagesUserSender.map(item => {

            const divMessageUser = document.createElement('div');
            divMessageUser.className = "messageUserLoged";

            const containerMessage = document.createElement('div');
            containerMessage.className = "containerMessage userLoged";
            containerMessage.innerHTML += `<span class="usernameLoged">${item.user_name}</span>`
            containerMessage.innerHTML += `<span class="messageBox">${item.message}</span>`
            containerMessage.innerHTML += `<span class='date_message'>${item.createdAt}</span>`; 

            divMessageUser.appendChild(containerMessage);
            containerChat.appendChild(divMessageUser);
        })

        messages.messagesUserReceiver.map(item => {

            const divMessageUser = document.createElement('div');
            divMessageUser.className = "messageOtherUser";

            const containerMessage = document.createElement('div');
            containerMessage.className = "containerMessage otherUser";
            containerMessage.innerHTML += `<span class="usernameLoged">${item.user_name}</span>`
            containerMessage.innerHTML += `<span class="messageBox">${item.message}</span>`
            containerMessage.innerHTML += `<span class='date_message'>${item.createdAt}</span>`; 

            divMessageUser.appendChild(containerMessage);
            containerChat.appendChild(divMessageUser);

        }) */
        

    });

}

socket.on('participants_list_all', connections => {

    const newParticipants = connections.filter(participant => participant.name !== username && participant.socket_id !== null);

    const informationUser = connections.filter(participant => participant.name == username);

    socket_user = informationUser[0].socket_id;

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

        divPeople.addEventListener('click', () => {

            socket_user_receiver = participant.socket_id;

            const params = {
                fkUser: id,
                fkUserParticipant: participant.user_id
            }

            listMessages(params);

            divLoadingSelectChat.style.display = "none";
            divContainerChat.style.display = "flex";
            document.getElementById('containerChat').innerHTML = "";

        })

        listDivPeople.append(divPeople);

    });
})

document.getElementById('buttonSubmitMessage').addEventListener('click', () => {

    const containerChat = document.getElementById('containerChat');

    const text = document.getElementById('messageUser');

    const params = {
        text: text.value,
        socket_user,
        socket_user_receiver,
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

    const { text, username_message } = message;

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