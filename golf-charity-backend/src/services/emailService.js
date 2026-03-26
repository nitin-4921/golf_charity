const transporter = require('../config/email');
const logger = require('../utils/logger');

const FROM = process.env.EMAIL_FROM || 'Golf Charity Platform <noreply@golfcharity.com>';

/**
 * Generic send helper — logs errors without crashing the app.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Email failed to ${to}: ${err.message}`);
  }
};

const sendSubscriptionConfirmation = (user, plan) =>
  sendEmail({
    to: user.email,
    subject: 'Welcome to Golf Charity Platform — Subscription Confirmed',
    html: `
      <h2>Hi ${user.name},</h2>
      <p>Your <strong>${plan}</strong> subscription is now active.</p>
      <p>You can now enter your scores and participate in monthly draws.</p>
      <p>Good luck and thank you for supporting charity!</p>
    `,
  });

const sendDrawResults = (user, draw) =>
  sendEmail({
    to: user.email,
    subject: `Draw Results — ${new Date(draw.drawDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`,
    html: `
      <h2>Hi ${user.name},</h2>
      <p>This month's draw numbers were: <strong>${draw.generatedNumbers.join(', ')}</strong></p>
      <p>Log in to your dashboard to see if you won.</p>
    `,
  });

const sendWinnerNotification = (user, matchCount, prizeAmount) =>
  sendEmail({
    to: user.email,
    subject: '🏆 Congratulations — You Won!',
    html: `
      <h2>Hi ${user.name},</h2>
      <p>You matched <strong>${matchCount} numbers</strong> in this month's draw!</p>
      <p>Your prize: <strong>£${(prizeAmount / 100).toFixed(2)}</strong></p>
      <p>Please log in and upload your score proof to claim your prize.</p>
    `,
  });

module.exports = { sendSubscriptionConfirmation, sendDrawResults, sendWinnerNotification };
