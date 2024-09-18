const { sendResponse, AppError } = require("../helpers/utils.js")
const { validationResult } = require('express-validator');
const Task = require("../models/Task.js")
const User = require("../models/User.js")

const taskController = {}
//Create a task
taskController.createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //in real project you will getting info from req
  const {
    name,
    description,
    status,
    assignedTo
  } = req.body
  const info = {
    name,
    description,
    status,
    assignedTo
  }
  try {
    //always remember to control your inputs
    if (!info) throw new AppError(402, "Bad Request - Need reasonable information", "No request body")

    if (!name || !description || !status) throw new AppError(400, "Bad Request", "Missing name / description / status")

    // Check if a task with the same name already exists
    const taskExisted = await Task.findOne({ name });
    if (taskExisted) throw new AppError(400, "Bad request", "Task with this name already exists");
    //mongoose query
    const created = await Task.create(info)
    sendResponse(res, 200, true, { data: created }, null, "Create Task Success")
  } catch (err) {
    next(err)
  }
}

//Get all tasks + filter + Sorting by createdAt, updatedAt
taskController.getAllTasks = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //in real project you will getting condition from from req then construct the filter object for query
  const { name, description, status } = req.query;

  // empty filter mean get all
  const filter = { isDeleted: false }

  try {
    //express validate
    if (name) filter.name = new RegExp(name, 'i');
    if (description) filter.description = new RegExp(description, 'i');
    //mongoose query
    const listOfFound = await Task.find(filter).sort({ createAt: -1, updatedAt: -1 })
    if (!listOfFound || listOfFound.length === 0) sendResponse(res, 404, false, null, "Not found", "Can't find task");

    sendResponse(res, 200, true, { data: listOfFound }, null, "Found list of tasks success")
  } catch (err) {
    next(err)
  }
}

//Get single Task by ID
taskController.getTaskById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { targetId } = req.params

  try {
    const taskTarget = await Task.findById(targetId)
    if (!taskTarget || taskTarget.isDeleted) sendResponse(res, 404, false, null, "Not found", "Can't find task with this id");

    sendResponse(res, 200, true, { data: taskTarget }, null, "Find task by ID success")
  } catch (err) {
    next(err)
  }
}

// Update the status of a task.
taskController.updateTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { targetId } = req.params; // The ID of the task being updated
  const { assignedTo, ...updateInfo } = req.body; // Extract the assignedTo field from the request body
  const options = { new: true }; // Return the updated document
  try {
    // Find the task by ID
    const taskTarget = await Task.findById(targetId);
    if (!taskTarget || taskTarget.isDeleted) return sendResponse(res, 404, false, null, "Not found", "Can't find task with this ID");

    // Check if the task is already done
    if (taskTarget.status === "done" && updateInfo.status !== "archive") {
      throw new AppError(400, "Bad Request", "A completed task can only be archived");
    }


    // 1. Unassign Task
    if (taskTarget.assignedTo && assignedTo === null) {
      // Remove the task from the previously assigned user's tasks array
      await User.findByIdAndUpdate(taskTarget.assignedTo, { $pull: { tasks: targetId } });
      updateInfo.assignedTo = null; // Unassign the task
    }

    // 2. Assign Task
    if (assignedTo) {
      // Check if the new user exists
      const user = await User.findById(assignedTo);
      if (!user) throw new AppError(400, "Bad Request", "Invalid user ID for assignment");

      // Check if the task was already assigned to a different user
      if (taskTarget.assignedTo && taskTarget.assignedTo !== assignedTo) {
        // Remove the task from the previous user's tasks array
        await User.findByIdAndUpdate(taskTarget.assignedTo, { $pull: { tasks: targetId } });
      }

      // Add the task to the new user's tasks array
      await User.findByIdAndUpdate(assignedTo, { $addToSet: { tasks: targetId } });

      // Update the assignedTo field of the task
      updateInfo.assignedTo = assignedTo;
    }

    // Update the task with the new information
    const updatedTask = await Task.findByIdAndUpdate(targetId, updateInfo, options).populate("assignedTo");
    sendResponse(res, 200, true, { data: updatedTask }, null, "Update new info for task by ID success");

  } catch (err) {
    next(err);
  }
};

// Delete - delete a task
taskController.deleteTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { targetId } = req.params
  const options = { new: true }
  try {
    const taskTarget = await Task.findById(targetId)
    if (!taskTarget || taskTarget.isDeleted) sendResponse(res, 404, false, null, "Not found", "Can't find task with this id");
    //mongoose query
    const updated = await Task.findByIdAndUpdate(targetId, { isDeleted: true }, options);
    sendResponse(res, 200, true, { data: updated }, null, "Task soft deleted successfully")
  } catch (err) {
    next(err)
  }
}

//export
module.exports = taskController