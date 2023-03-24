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

const {
  UpdateUserController,
} = require("./modules/users/controllers/UpdateUserController");
const {
  UpdatePreferencesController,
} = require("./modules/users/controllers/UpdatePreferencesController");

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

router.patch(
  "/avatar",
  ensureAuthenticated,
  avatarUpload.single("avatar"),
  new UpdateAvatarUserController().execute
);

router.patch("/user", ensureAuthenticated, new UpdateUserController().execute);
router.patch(
  "/user/preferences",
  ensureAuthenticated,
  new UpdatePreferencesController().execute
);

module.exports = { router };
