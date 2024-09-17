const { sendResponse, AppError } = require("../helpers/utils.js")
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).send("Welcome to CoderManangement =]]!")
});



//Add task api to index routes
const taskRouter = require('./task.api.js');
router.use('/tasks', taskRouter)

//Add user api to index routes
const userRouter = require('./user.api.js')
router.use("/users", userRouter)


module.exports = router;
