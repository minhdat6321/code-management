const express = require("express");
const router = express.Router();
const { createUser, getAllUsers, getUserById, editUser, getTasksByUserId, deleteUser } = require("../controllers/user.controllers")
const {
  validateCreateUser,
  validateUserId,
  validateUpdateUser,
  validateDeleteUser
} = require('../validators/User');
/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */
router.post("/", validateCreateUser, createUser)

/**
 * @route GET api/users
 * @description Get a list of users
 * @access private
 * @allowedQueries: name
 */
router.get("/", getAllUsers)

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
router.get("/:targetId", validateUserId, getUserById)


/**
 * @route GET api/users/:id/tasks
 * @description Get tasks user by id
 * @access public
 */
router.get('/:targetId/tasks', validateUserId, getTasksByUserId)


/**
 * @route PUT api/users/:id
 * @description Update new Information a user
 * @access private, assigner
 * @allowedEdits : {"role": String enum ["manager", "employee"],
 *                  "name": String}
 */
router.put('/:targetId', validateUpdateUser, editUser)


/**
 * @route DELETE api/users/:id
 * @description delete user by id
 * @access public
 */
router.delete("/:targetId", validateDeleteUser, deleteUser)

module.exports = router;