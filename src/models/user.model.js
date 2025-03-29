const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'student',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    mobileNumber: {
      type: String,
      trim: true,
      validate(value) {
        if (value && !validator.isMobilePhone(value)) {
          throw new Error('Invalid mobile number');
        }
      },
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    preferredLanguage: {
      type: String,
      trim: true,
      default: 'English',
    },
    bio: {
      type: String,
      trim: true,
    },
    educationBackground: [{
      institutionName: {
        type: String,
        trim: true,
      },
      degree: {
        type: String,
        trim: true,
      },
      fieldOfStudy: {
        type: String,
        trim: true,
      },
      startYear: {
        type: Number,
      },
      endYear: {
        type: Number,
      },
      currentlyStudying: {
        type: Boolean,
        default: false,
      },
    }],
    workExperience: [{
      companyName: {
        type: String,
        trim: true,
      },
      title: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      currentlyWorking: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
        trim: true,
      },
    }],
    skills: [{
      name: {
        type: String,
        trim: true,
      },
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      },
      verified: {
        type: Boolean,
        default: false,
      },
    }],
    interests: [{
      type: String,
      trim: true,
    }],
    socialProfiles: {
      linkedin: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      portfolio: {
        type: String,
        trim: true,
      },
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    institution: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Institution',
    },
    employer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Employer',
    },
    // Mentor-specific fields
    mentorProfile: {
      expertise: [{
        type: String,
        trim: true,
      }],
      experienceYears: {
        type: Number,
      },
      hourlyRate: {
        type: Number,
      },
      availability: [{
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
      }],
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    // Faculty-specific fields
    facultyProfile: {
      designation: {
        type: String,
        trim: true,
      },
      department: {
        type: String,
        trim: true,
      },
      employeeId: {
        type: String,
        trim: true,
      },
      facultyType: {
        type: String,
        enum: ['full-time', 'part-time', 'visiting', 'guest'],
      },
    },
    // Student-specific fields
    studentProfile: {
      registrationNumber: {
        type: String,
        trim: true,
      },
      enrollmentYear: {
        type: Number,
      },
      graduationYear: {
        type: Number,
      },
      currentSemester: {
        type: Number,
      },
      learningPaths: [{
        pathId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'LearningPath',
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        completedModules: [{
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Module',
        }],
        currentModule: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Module',
        },
        progress: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
        certificates: [{
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Certificate',
        }],
      }],
      mentorships: [{
        mentorId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['active', 'completed', 'cancelled'],
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        feedback: {
          type: String,
          trim: true,
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
      }],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
