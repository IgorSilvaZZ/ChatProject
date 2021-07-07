document.getElementById('btnSubmit').addEventListener('click', () => {

    fetch('http://localhost:3333/authenticate',{
        method: 'post',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({ 
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        })
    }).then(res => {
        if(res.status === 200){
            res.json().then(response => {

                localStorage.setItem('username', JSON.stringify(response.user.name));
                localStorage.setItem('email', JSON.stringify(response.user.email));
                localStorage.setItem('token', JSON.stringify(response.token));
                localStorage.setItem('id', JSON.stringify(response.user.id));

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