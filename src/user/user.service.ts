import createHttpError from 'http-errors'
import prisma from '../prisma/prisma.service'

const getAllUser = async (verified?: boolean) => {
  const users = await prisma.user.findMany({
    where: {
      verified,
    },
    select: {
      id: true,
      address: true,
      name: true,
      surname: true,
      email: true,
      role: true,
      phone: true,
      verified: true
    }
  })
  return users
}

const getAllAdmins = async () => {
  const admins = await prisma.user.findMany({
    where: {
      role: 'admin',
    },
    select: {
      id: true,
      address: true,
      name: true,
      surname: true,
      email: true,
      role: true,
      phone: true,
      verified: true
    }
  })
  return admins
}

const toggleAdmin = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw createHttpError(404, 'User not found')
  }

  const toggleUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: user.role === 'user' ? 'admin' : 'user',
      verified: true
    },
    select: {
      id: true,
      address: true,
      name: true,
      surname: true,
      email: true,
      role: true,
      phone: true,
      verified: true
    }
  })

  return toggleUser
}

const deleteUsers = async () => {
  const { count } = await prisma.user.deleteMany({
    where: {
      verified: false,
    },
  })

  return count
}

export default {
  getAllUser,
  getAllAdmins,
  toggleAdmin,
  deleteUsers,
}
