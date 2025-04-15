


import Joi from 'joi';

export const createPromotionSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  media: Joi.string().uri().required(),
  link: Joi.string().uri().required(),
  status: Joi.string().valid("active", "inactive").required(),
});

export const editPromotionSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  type: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  media: Joi.string().uri(),
  link: Joi.string().uri(),
  status: Joi.string().valid("active", "inactive"),
});

export const createNotificationSchema = Joi.object({
  users: Joi.array().items(
    Joi.object({
      user: Joi.alternatives().try(Joi.string().required(), Joi.valid("*"))
    })
  ).min(1).required(),

  type: Joi.string().valid("email", "in-app").required(),

  subject: Joi.string().required(),
  content: Joi.string().required(),
  media: Joi.string().optional(),
  link: Joi.string().optional(),
});
