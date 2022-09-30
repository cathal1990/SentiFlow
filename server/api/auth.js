const User = require('../db/User.js')
const router = require('express').Router()

const requireToken = async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const user = await User.findByToken(token);
      req.user = user;
      next();
    } catch(error) {
      next(error);
    }
  };

router.post("/login", async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (ex) {
    next(ex);
  }
});

// sign up on website, (takes whatever is in req.body)
router.post("/signup", async(req,res,next) => {
  try {
    let newUser = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    if (!newUser) {
      newUser = await User.create(req.body)
      res.status(200).send({ token: await User.authenticate(req.body)})
    }
    else {
      res.sendStatus(403)
    }
  } catch (ex) {
    next(ex)
  }
})

router.get("/", requireToken, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router