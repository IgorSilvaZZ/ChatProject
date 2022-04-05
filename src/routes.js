const { Router } = require("express");
const multer = require("multer");

const router = Router();

const { ensureAuthenticated } = require("./middlewares/AuthMiddleware");
const { upload } = require("./config/upload");

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
  UpdateAvatarUserController,
} = require("./modules/users/controllers/UpdateAvatarUserController");

const avatarUpload = multer(upload("./tmp/avatar"));

router.post("/createUser", new CreateUserController().execute);
router.post("/authenticate", new AuthenticateUserController().execute);
router.get("/user/:id", ensureAuthenticated, new GetUserController().execute);

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

router.patch(
  "/avatar",
  ensureAuthenticated,
  avatarUpload.single("avatar"),
  new UpdateAvatarUserController().execute
);

module.exports = { router };
