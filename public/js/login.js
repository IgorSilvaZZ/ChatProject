document.getElementById('btnSubmit').addEventListener('click', () => {

    fetch('http://localhost:3333/login',{
        method: 'post',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({ 
            username: document.getElementById('userName').value
        })
    }).then(res => {
        if(res.status === 200){
            res.json().then(response => {
                localStorage.setItem('username', JSON.stringify(response.username));
                Toastify({
                    text: "Login efetuado com Sucesso",
                    backgroundColor: "linear-gradient(to right, #2ecc71, #27ae60)",
                    duration: 2000,
                }).showToast();
                setTimeout(() => {
                    window.location = '/chat'
                }, 2000);
            })
        }
    }).catch(err => {
        console.log(err);
    });
})