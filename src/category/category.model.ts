import Joi from 'joi'

const createCategoryScheme = Joi.object({
  name: Joi.string().required(),
})


export default {
  createCategoryScheme,
}
