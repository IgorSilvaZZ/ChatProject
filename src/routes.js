const { Router } = require("express");

const router = Router();

const { ensureAuthenticated } = require("./middlewares/AuthMiddleware");

//Implementaçoes Nova
const {
  CreateUserController,
} = require("./modules/users/controllers/CreateUserController");

const {
  AuthenticateUserController,
} = require("./modules/users/controllers/AuthenticateUserController");

const {
  GetUserController,
} = require("./modules/users/controllers/GetUserController");

const {
  ListMessagesController,
} = require("./modules/messages/controllers/ListMessagesController");

router.post("/createUser", new CreateUserController().execute);
router.post("/authenticate", new AuthenticateUserController().execute);
router.get("/user/:id", ensureAuthenticated, new GetUserController().execute);

router.get("/messages", new ListMessagesController().handle);

router.get("/", (req, res) => {
  return res.render("html/index.html");
});

router.get("/chat", (req, res) => {
  return res.render("html/chat.html");
});

router.get("/register", (req, res) => {
  return res.render("html/register.html");
});

router.get("/profile", (req, res) => {
  return res.render("html/profile.html");
});

module.exports = { router };
