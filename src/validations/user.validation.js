const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().valid('student', 'mentor', 'admin', 'institution', 'employer'),
    mobileNumber: Joi.string().allow('').allow(null),
    profilePicture: Joi.string().allow('').allow(null),
    city: Joi.string().allow('').allow(null),
    state: Joi.string().allow('').allow(null),
    country: Joi.string().allow('').allow(null),
    preferredLanguage: Joi.string().allow('').allow(null),
    bio: Joi.string().allow('').allow(null),
    institution: Joi.string().custom(objectId).allow(null),
    employer: Joi.string().custom(objectId).allow(null),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      mobileNumber: Joi.string().allow('').allow(null),
      profilePicture: Joi.string().allow('').allow(null),
      city: Joi.string().allow('').allow(null),
      state: Joi.string().allow('').allow(null),
      country: Joi.string().allow('').allow(null),
      preferredLanguage: Joi.string().allow('').allow(null),
      bio: Joi.string().allow('').allow(null),
      educationBackground: Joi.array().items(
        Joi.object({
          institutionName: Joi.string().required(),
          degree: Joi.string().required(),
          fieldOfStudy: Joi.string().required(),
          startYear: Joi.number().integer().required(),
          endYear: Joi.number().integer(),
          currentlyStudying: Joi.boolean(),
        })
      ),
      workExperience: Joi.array().items(
        Joi.object({
          companyName: Joi.string().required(),
          title: Joi.string().required(),
          location: Joi.string(),
          startDate: Joi.date().required(),
          endDate: Joi.date(),
          currentlyWorking: Joi.boolean(),
          description: Joi.string(),
        })
      ),
      skills: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
        })
      ),
      interests: Joi.array().items(Joi.string()),
      socialProfiles: Joi.object({
        linkedin: Joi.string(),
        github: Joi.string(),
        twitter: Joi.string(),
        portfolio: Joi.string(),
      }),
      mentorProfile: Joi.object({
        expertise: Joi.array().items(Joi.string()),
        experienceYears: Joi.number().integer(),
        hourlyRate: Joi.number(),
        availability: Joi.array().items(
          Joi.object({
            day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
            startTime: Joi.string().required(),
            endTime: Joi.string().required(),
          })
        ),
        isActive: Joi.boolean(),
      }),
      facultyProfile: Joi.object({
        designation: Joi.string(),
        department: Joi.string(),
        employeeId: Joi.string(),
        facultyType: Joi.string().valid('full-time', 'part-time', 'visiting', 'guest'),
      }),
      studentProfile: Joi.object({
        registrationNumber: Joi.string(),
        enrollmentYear: Joi.number().integer(),
        graduationYear: Joi.number().integer(),
        currentSemester: Joi.number().integer(),
      }),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};