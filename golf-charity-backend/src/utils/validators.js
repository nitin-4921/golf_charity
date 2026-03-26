const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  // charityId is optional — only validate format if provided and looks like an ObjectId
  charityId: Joi.string().hex().length(24).optional().allow(null, ''),
  charityContributionPercentage: Joi.number().min(10).max(100).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const scoreSchema = Joi.object({
  value: Joi.number().integer().min(1).max(45).required(),
  date: Joi.date().iso().max('now').required(),
});

const charitySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).required(),
  image: Joi.string().uri().optional().allow('', null),
  website: Joi.string().uri().optional().allow('', null),
  isFeatured: Joi.boolean().optional(),
});

const drawConfigSchema = Joi.object({
  drawType: Joi.string().valid('random', 'algorithm').required(),
  isSimulation: Joi.boolean().optional(),
});

const verificationSchema = Joi.object({
  proofUrl: Joi.string().uri().required(),
});

const adminVerifySchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
  adminNote: Joi.string().optional().allow('', null),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({ success: false, message: messages });
  }
  next();
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  scoreSchema,
  charitySchema,
  drawConfigSchema,
  verificationSchema,
  adminVerifySchema,
};
