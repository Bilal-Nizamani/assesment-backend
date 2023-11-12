import { validPassword, genPassword, issueJWT } from "../utils/authService.js";
import User from "../databasemodels/user.js";

const userRegisterHandler = async (req, res, next) => {
  console.log(req.body);

  const saltHash = genPassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    hash: hash,
    salt: salt,
  });

  try {
    const user = await newUser.save();
    res.json({ success: true, user: user });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyValue) {
      // Duplicate key error (E11000)
      console.log("duplicate name or user");
      const duplicateKey = Object.keys(err.keyPattern)[0];
      const duplicateValue = err.keyValue[duplicateKey];

      return res.status(200).json({
        success: false,
        error: ` ${duplicateKey} '${duplicateValue}' already exists.`,
      });
    } else {
      // Handle other errors
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
};

const userLoginHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      // user not found
      return res
        .status(200)
        .json({ success: false, error: "In valid credentials" });
    }

    const isValid = validPassword(req.body.password, user.hash, user.salt);

    if (isValid) {
      const tokenObject = issueJWT(user);

      res.status(200).json({
        success: true,
        token: tokenObject.token,
        user: user,
        expiresIn: tokenObject.expires,
      });
    } else {
      // wrong password
      res.status(200).json({ success: false, error: "In correct credentials" });
    }
  } catch (err) {
    // Assuming you have a custom error handler to send clean error messages to the frontend
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
const protectedRouteHandler = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "You are successfully authenticated to this route!",
  });
};

export { userRegisterHandler, userLoginHandler, protectedRouteHandler };
