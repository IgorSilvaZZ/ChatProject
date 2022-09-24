const { verify } = require("jsonwebtoken");
const { secret } = require("../config/auth.json");

const ensureAuthenticated = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).end();
  }

  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(token, secret);

    req.userId = sub;

    return next();
  } catch (error) {
    return res.status(401).end();
  }
};

module.exports = { ensureAuthenticated };
