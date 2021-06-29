const { Router } = require('express');

const router = Router();

const { UserController } = require('./controllers/UserController');
const { AuthController } = require('./controllers/AuthController');

const userController = new UserController();
const authController = new AuthController();

router.post('/createUser', userController.create);
router.post('/authenticate', authController.handle);

router.get('/index', (req, res) => {
    return res.render('html/index.html');
});

router.get('/chat', (req, res) => {
    return res.render('html/chat.html');
});

module.exports = { router };