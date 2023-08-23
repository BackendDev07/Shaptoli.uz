import prisma from '../prisma/prisma.service'
import bcrypt from 'bcrypt'
import verifyService from './verify.service'
import { sendMail } from '../common/mailer.service'
import forgotPasswordService from './forgot-password.service'
import createError from 'http-errors'

const register = async (email: string, password: string) => {
  const findedUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  if (findedUser) {
    throw createError(400, 'Email already exists')
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
    },
  })

  const verification = await verifyService.createVerification({
    email,
    userId: user.id,
  })

  sendMail(email, verification.code)

  return verification
}

const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw createError(404, 'User not found')
  }

  const compare = await bcrypt.compare(password, user.password)

  if (!compare) {
    throw createError(400, 'Wrong Password')
  }

  return user
}

const verification = async (verificationId: string, code: string) => {
  const verification = await verifyService.findVerification(verificationId)
  if (!verification) {
    throw createError(404, 'Verification not found')
  }

  const codeIsValid = +code === verification.code

  if (codeIsValid) {
    const user = await prisma.user.update({
      where: {
        id: verification.userId,
      },
      data: {
        verified: true,
        role: 'user',
      },
    })
    return user
  } else {
    throw createError(400, 'Code not valid')
  }
}

const resend = async (
  email: string,
  userId: number,
  verificationId: string
) => {
  const verification = await verifyService.findVerification(verificationId)

  if (verification) {
    throw createError(400, 'Verification not expiried')
  }

  const newVerification = await verifyService.createVerification({
    email,
    userId,
  })

  sendMail(email, newVerification.code)

  return newVerification
}

const forgotPasswordEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      AND: {
        verified: true,
      },
    },
  })

  if (!user) {
    throw createError(404, 'User not found')
  }

  const forgotPassword = await forgotPasswordService.createForgotPassword(email)

  const link = `http://localhost:3000/api/v1/auth/forgot-password/?id=${
    forgotPassword.id
  }&code=${forgotPassword.code}&time=${new Date(forgotPassword.date).getTime()}`

  sendMail(email, link)

  return forgotPassword
}

const forgotPasswordLink = async (
  id: string,
  code: number,
  password: string
) => {
  const forgotPassword = await forgotPasswordService.findForgotPassword(id)

  if (!forgotPassword) {
    throw createError(404, 'Forgot password expired')
  }

  const codeIsValid = code === forgotPassword.code

  if (codeIsValid) {
    const user = await prisma.user.update({
      where: {
        email: forgotPassword.email,
      },
      data: {
        password,
      },
    })

    return user
  }

  throw createError(400, 'Code not valid')
}

export default {
  register,
  login,
  verification,
  resend,
  forgotPasswordEmail,
  forgotPasswordLink,
}
