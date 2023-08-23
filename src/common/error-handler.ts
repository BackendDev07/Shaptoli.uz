import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'

export const errorHandler = (
  error: Error | createHttpError.HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof createHttpError.HttpError) {
    res.status(error.statusCode ?? 500).send({
      message: error.message,
    })
  } else {
    res.status(500).send({
      message: 'Something went wrong',
    })
  }
}
