const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch((error) => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env', error));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = { from: config.email.from, to, subject, text, html };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.clientUrl}/reset-password?token=${token}`;
  const text = `Dear user,\nTo reset your password, click on this link: ${resetPasswordUrl}\nIf you did not request any password resets, then ignore this email.`;
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #4a6cf7; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">SKILL BRIDGE</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
      <h2>Reset Your Password</h2>
      <p>Dear user,</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetPasswordUrl}" style="background-color: #4a6cf7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
      </div>
      <p>This link will expire in ${config.jwt.resetPasswordExpirationMinutes} minutes.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>Best regards,<br>The SKILL BRIDGE Team</p>
    </div>
  </div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;
  const text = `Dear user,\nTo verify your email, click on this link: ${verificationEmailUrl}\nIf you did not create an account, then ignore this email.`;
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #4a6cf7; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">SKILL BRIDGE</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
      <h2>Verify Your Email Address</h2>
      <p>Dear user,</p>
      <p>Thank you for registering with SKILL BRIDGE! To complete your registration, please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationEmailUrl}" style="background-color: #4a6cf7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Verify Email</a>
      </div>
      <p>This link will expire in ${config.jwt.verifyEmailExpirationMinutes} minutes.</p>
      <p>If you didn't create an account with us, you can safely ignore this email.</p>
      <p>Best regards,<br>The SKILL BRIDGE Team</p>
    </div>
  </div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send welcome email
 * @param {string} to
 * @param {string} name
 * @returns {Promise}
 */
const sendWelcomeEmail = async (to, name) => {
  const subject = 'Welcome to SKILL BRIDGE';
  const text = `Dear ${name},\nWelcome to SKILL BRIDGE! We're excited to have you on board.\nOur platform is designed to help you bridge the gap between education and industry requirements through our comprehensive domain-based learning approach.\nIf you have any questions, feel free to reach out to our support team.\nBest regards,\nThe SKILL BRIDGE Team`;
  const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #4a6cf7; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">SKILL BRIDGE</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
      <h2>Welcome to SKILL BRIDGE!</h2>
      <p>Dear ${name},</p>
      <p>We're thrilled to welcome you to the SKILL BRIDGE community! You've taken an important step towards closing the gap between education and industry requirements.</p>
      <h3>What's Next?</h3>
      <ul>
        <li>Complete your profile to help us personalize your learning experience</li>
        <li>Explore our learning paths and find the one that best matches your goals</li>
        <li>Connect with mentors and fellow learners in your domain</li>
      </ul>
      <p>Our hybrid expert-guided learning model combines the best of online education with in-person institutional support, creating a seamless path to industry readiness.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${config.clientUrl}/dashboard" style="background-color: #4a6cf7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Go to Dashboard</a>
      </div>
      <p>If you have any questions or need assistance, our support team is here to help!</p>
      <p>Best regards,<br>The SKILL BRIDGE Team</p>
    </div>
  </div>`;
  await sendEmail(to, subject, text, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
};