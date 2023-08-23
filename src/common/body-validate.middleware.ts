import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

const bodyValidate = (joiScheme: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = joiScheme.validate(req.body)

    if (error) {
      res.status(400).send({
        message: error.name,
        error: error.message,
      })
      return
    }
    next()
  }
}

export default bodyValidate
