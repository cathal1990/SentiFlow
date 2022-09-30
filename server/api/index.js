const router = require("express").Router();

// put your api routes here, for example:
router.use('/tweets', require('./tweets.js'))

// router.use('/admin', require('./admin.js'))
// router.use("/auth", require("./auth.js"));

module.exports = router;
