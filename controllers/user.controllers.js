const { sendResponse, AppError } = require("../helpers/utils.js")

const User = require("../models/User.js")
const { validationResult } = require('express-validator');

const userController = {}
//Create a user
userController.createUser = async (req, res, next) => {
  //in real project you will getting info from req
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, role } = req.body;
  const info = { name, role };
  try {
    //always remember to control your inputs
    if (!name) throw new AppError(402, "Bad Request", "Create User Error: Missing name");
    // Check if a user with the same name already exists
    const userExisted = await User.findOne({ name });
    if (userExisted) {
      throw new AppError(400, "Bad Request", "User with this name already exists");
    }

    //mongoose query
    const created = await User.create(info)
    sendResponse(res, 200, true, { data: created }, null, "Create User Success")
  } catch (err) {
    next(err)
  }
}

//Get all users
userController.getAllUsers = async (req, res, next) => {
  //in real project you will getting condition from from req then construct the filter object for query
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, role } = req.query;

  // empty filter mean get all
  const filter = {}

  try {
    if (name) filter.name = new RegExp(name, 'i');
    if (role) filter.role = role;
    //mongoose query
    const listOfFound = await User.find(filter)
    sendResponse(res, 200, true, { data: listOfFound }, null, "Found list of uesers success")
  } catch (err) {
    next(err)
  }
}

//Get detail User by ID
userController.getUserById = async (req, res, next) => {
  //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //you will also get updateInfo from req
  const { targetId } = req.params

  try {

    const userTarget = await User.findById(targetId)
    if (!userTarget) sendResponse(res, 404, false, null, "Not found", "Can't find User with this id");
    //mongoose query
    const userFound = await User.findById(targetId).populate("tasks")
    if (!userFound) sendResponse(res, 404, false, null, "Not found", "Can't find user with this id");
    sendResponse(res, 200, true, { data: userFound }, null, "Find employee by ID success")
  } catch (err) {
    next(err)
  }
}

//Get tasks by User ID
userController.getTasksByUserId = async (req, res, next) => {
  //in real project you will getting id from req. For updating and deleting, it is recommended for 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { targetId } = req.params

  try {
    const userTarget = await User.findById(targetId)
    if (!userTarget) sendResponse(res, 404, false, null, "Not found", "Can't find User with this id");
    //mongoose query
    const userFound = await User.findById(targetId).populate("tasks")
    if (!userFound) sendResponse(res, 404, false, null, "Not found", "Can't find user with this id");
    sendResponse(res, 200, true, { tasks: userFound.tasks }, null, "Find employees'TASK by ID success")
  } catch (err) {
    next(err)
  }
}

//Update User by ID
userController.editUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { targetId } = req.params
  const updateInfo = req.body
  const options = { new: true }
  try {
    const userTarget = await User.findById(targetId)
    if (!userTarget) sendResponse(res, 404, false, null, "Not found", "Can't find User with this id");

    if (!updateInfo) throw new AppError(400, "Bad Request", "Require Update Information for an Employee ID")
    //mongoose query
    const updated = await User.findByIdAndUpdate(targetId, updateInfo, options).populate("tasks")
    sendResponse(res, 200, true, { data: updated }, null, "Update new info for employee by ID success")
  } catch (err) {
    next(err)
  }
}

//Delete User by ID
userController.deleteUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { targetId } = req.params

  // empty target mean delete nothing
  //options allow you to modify query. e.g new true return lastest update of data
  const options = { new: true }
  try {
    const userTarget = await User.findById(targetId)
    if (!userTarget) sendResponse(res, 404, false, null, "Not found", "Can't find User with this id");
    //mongoose query
    const updated = await User.findByIdAndUpdate(targetId, { isDeleted: true }, options);
    sendResponse(res, 200, true, { data: updated }, null, "User soft deleted successfully")
  } catch (err) {
    next(err)
  }
}

//exports
module.exports = userController