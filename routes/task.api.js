const express = require("express");
const router = express.Router();

const { createTask, getAllTasks, getTaskById, updateTask, deleteTask, } = require("../controllers/task.controllers.js");
const { validateCreateTask, validateTaskId, validateUpdateTask } = require('../validators/Task.js');

//CREATE
/**
 * @route POST api/tasks
 * @description Create new task
 * @access private, assigner
 */

router.post("/", validateCreateTask, createTask);

//READ
/**
 * @route GET API/tasks
 * @description Get a list of tasks
 * @access public
 * @parameters : "status", "createdAt", "updatedAt", "name"
 */
router.get("/", getAllTasks);

//READ
/**
 * @route GET API/tasks/:id
 * @description Get task by Id
 * @access public
 * @parameters : "status", "createdAt", "updatedAt", "name"
 */
router.get("/:targetId", validateTaskId, getTaskById);

//UPDATE
/**
 * @route PUT api/tasks/:id
 * @description Update a task's status
 * @access private, assigner
 * @allowedUpdates : {"description": string, 
 *                    "newStatus": string, 
 *                   "newAssignee": objectID string to assign task,
 *                   "removeAssignee": objectID string to unassign}
 */
router.put("/:targetId", validateUpdateTask, updateTask);

//DELETE
/**
 * @route DELETE api/tasks/:id
 * @description Delete a task
 * @access private, assigner
 */
router.delete("/:targetId", validateTaskId, deleteTask);

module.exports = router;