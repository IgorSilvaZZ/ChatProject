const username = JSON.parse(localStorage.getItem('username'));
const id = JSON.parse(localStorage.getItem('id'));
const token = JSON.parse(localStorage.getItem('token'));

const getDataUser = async() => {

    try{

        const res = await fetch(`http://localhost:3333/user/${id}`, {
            headers: {
                'Content-type': 'application/json',
                authorization: String(token)
            }
        });

        const user = await res.json();

        console.log(user);

    }catch(err) {
        Toastify({
            text: "Erro ao fazer a requisição, tente novamente mais tarde!", 
            backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)",
            duration: 2000,
        }).showToast(); 
    }

}

document.getElementById('chat').addEventListener('click', () => {
    window.location = "/chat";
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

    getDataUser();

})