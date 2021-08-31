const { Router } = require('express');

const router = Router();

const { UserController } = require('./controllers/UserController');
const { AuthController } = require('./controllers/AuthController');
const { ensureAuthenticated } = require('./middlewares/AuthMiddleware')

const userController = new UserController();
const authController = new AuthController();

router.post('/createUser', userController.create);
router.post('/authenticate', authController.handle);
router.get('/user/:id', ensureAuthenticated, userController.listUser);

//Rota para teste para listar as conexões
router.get('/connectionsUser', userController.connectionsUsers);
//Rota para teste de envio de Messagem
router.post('/sendMessage', userController.sendMessage)

router.get('/messages', userController.listMessages)

router.get('/index', (req, res) => {
    return res.render('html/index.html');
});

router.get('/chat', (req, res) => {
    return res.render('html/chat.html');
});

router.get('/register', (req, res) => {
    return res.render('html/register.html')
})

router.get('/profile', (req, res) => {
    return res.render('html/profile.html')
})

module.exports = { router };