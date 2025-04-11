// import Joi from 'joi';

// export const createPromotionSchema = Joi.object({
//   title: Joi.string().required(),
//   description: Joi.string().required(),
//   type: Joi.string().valid("banner", "video", "poster", "notice").required(),
//   startDate: Joi.date().required(),
//   endDate: Joi.date().required(),
//   media: Joi.string().uri().required(),
//   link: Joi.string().uri().optional(),
//   status: Joi.string().valid("active", "experied").optional(),
// });


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
