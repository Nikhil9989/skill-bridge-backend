const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

// Admin routes - manage all users
router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

// Profile routes - for current user
router.get('/profile/me', auth(), userController.getUserProfile);
router.patch('/profile/me', auth(), validate(userValidation.updateUser), userController.updateUserProfile);

// Mentors routes
router.get('/mentors', auth(), userController.getMentors);

// Students routes
router.get('/students', auth('getStudents'), userController.getStudents);

module.exports = router;