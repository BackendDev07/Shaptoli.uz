import { User } from '@prisma/client'

export const userDto = (payload: any): Omit<User, 'password'> => {
  return {
    id: payload.id,
    name: payload.name,
    surname: payload.surname,
    email: payload.email,
    address: payload.address,
    phone: payload.phone,
    verified: payload.verified,
    role: payload.role,
  }
}
