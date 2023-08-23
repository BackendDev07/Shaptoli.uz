import { User, Role } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

export const userVerify = (roles: Array<Role>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization

      if (!accessToken) {
        throw createHttpError(401, 'Token not found')
      }

      const verifyToken = jwt.verify(
        accessToken,
        process.env.JWT_SECRET ?? 'SECRET'
      ) as User

      if (!roles.includes(verifyToken.role as Role)) {
        throw createHttpError(403, 'Permission denied')
      }

      res.locals = {
        user: verifyToken,
      }

      next()
    } catch (e) {
      next(e)
    }
  }
}
