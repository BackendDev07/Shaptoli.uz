import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import authService from './auth.service'
import { User } from '@prisma/client'
import { userDto } from './auth.dto'
import createHttpError from 'http-errors'

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const { id, userId } = await authService.register(email, password)

    res.send({
      message: 'Register successful',
      verificationId: id,
      timeout: process.env.VERIFICATION_TIMEOUT,
      userId,
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const { password: pass, ...rest } = await authService.login(email, password)
    const accessToken = jwt.sign(rest, process.env.JWT_SECRET ?? 'SECRET')

    res.send({
      message: 'Login Successful',
      user: rest,
      accessToken,
    })
  } catch (e) {
    next(e)
  }
}

const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1]

    if (!accessToken) {
      throw createHttpError(404, 'Token not found')
    }

    const jwtPayload = jwt.verify(
      accessToken,
      process.env.JWT_SECRET ?? 'SECRET'
    ) as Omit<User, 'password'>

    res.locals = {
      user: {
        id: jwtPayload.id,
        email: jwtPayload.email,
        verified: jwtPayload.verified,
      },
    }

    res.send({
      message: 'Token Verified',
      user: userDto(jwtPayload),
    })
  } catch (e) {
    next(e)
  }
}

const verification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { verificationId, code } = req.body
    const user = await authService.verification(verificationId, code)
    if (!user) {
      throw createHttpError(404, 'User not found')
    }

    const { password, ...rest } = user
    const accessToken = jwt.sign(rest, process.env.JWT_SECRET ?? 'SECRET')

    res.send({
      message: 'Verification Successful',
      user: rest,
      accessToken,
    })
  } catch (e) {
    next(e)
  }
}

const resend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { verificationId, email, userId } = req.body
    const verification = await authService.resend(email, userId, verificationId)

    res.send({
      message: 'Resend Code',
      verificationId: verification.id,
      userId: verification.userId,
      timeout: process.env.VERIFICATION_TIMEOUT,
    })
  } catch (e) {
    next(e)
  }
}

const forgotPasswordEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body

    await authService.forgotPasswordEmail(email)

    res.send({
      message: `A password reset link has been sent to ${email}`,
    })
  } catch (e) {
    next(e)
  }
}

const forgotPasswordLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, code, time } = req.query
    const { password } = req.body

    if (!id || !code) throw createHttpError(400, '"id" or "code" not found')

    await authService.forgotPasswordLink(
      String(id),
      +code,
      password
    )

    res.send({
      message: 'Password Updated',
    })
  } catch (e) {
    next(e)
  }
}

export default {
  register,
  login,
  verify,
  verification,
  resend,
  forgotPasswordEmail,
  forgotPasswordLink,
}
