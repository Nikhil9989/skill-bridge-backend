const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

/**
 * Create a user
 * @public
 */
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

/**
 * Get all users
 * @public
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

/**
 * Get user by id
 * @public
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

/**
 * Update user
 * @public
 */
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

/**
 * Delete user
 * @public
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get mentors
 * @public
 */
const getMentors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'expertise']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.getMentors(filter, options);
  res.send(result);
});

/**
 * Get students
 * @public
 */
const getStudents = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'institution']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.getStudents(filter, options);
  res.send(result);
});

/**
 * Get current user profile
 * @public
 */
const getUserProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

/**
 * Update current user profile
 * @public
 */
const updateUserProfile = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  res.send(user);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMentors,
  getStudents,
  getUserProfile,
  updateUserProfile,
};