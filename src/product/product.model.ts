import Joi from 'joi'

const createProduct = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  categoryId: Joi.number().min(1).required()
})

const updateProduct = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  description: Joi.string(),
})

const createDetail = Joi.object({
  key: Joi.string().required(),
  value: Joi.string().required(),
})

const updateDetail = Joi.object({
  key: Joi.string(),
  value: Joi.string(),
})

export default {
  createDetail,
  createProduct,
  updateDetail,
  updateProduct,
}
