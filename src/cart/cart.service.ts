import createHttpError from 'http-errors'
import prisma from '../prisma/prisma.service'

const addProductToCard = async (productId: number, userId: number) => {
  const cart = await prisma.cart.findFirst({
    where: {
      productId,
      AND: {
        userId,
      },
    },
  })

  if (cart) {
    const updatedCart = await prisma.cart.update({
      where: {
        id: cart.id,
        productId,
        AND: {
          userId,
        },
      },
      data: {
        count: {
          increment: 1,
        },
      },
    })
    return updatedCart
  }
  const newCart = await prisma.cart.create({
    data: {
      count: 1,
      productId,
      userId,
    },
  })
  return newCart
}

const removeProductFromCart = async (userId: number, productId: number) => {
  const cart = await prisma.cart.findFirst({
    where: {
      productId,
      AND: {
        userId,
      },
    },
  })

  if (!cart) {
    throw createHttpError(404, 'Cart Not Found')
  }

  if (cart.count > 1) {
    const updatedCart = await prisma.cart.update({
      where: {
        id: cart.id,
        productId,
        AND: {
          userId,
        },
      },
      data: {
        count: {
          decrement: 1,
        },
      },
    })

    return updatedCart
  }

  const deletedCart = await prisma.cart.delete({
    where: {
      id: cart.id,
    },
  })

  return deletedCart
}

const getUserCart = async (userId: number) => {
  const cart = await prisma.cart.findMany({
    where: {
      userId,
    },
  })
  return cart
}

const clearUserCart = async (userId: number) => {
  const deletedCarts = await prisma.cart.deleteMany({
    where: {
      userId,
    },
  })
  return deletedCarts
}

const deleteProductFromCart = async (userId: number, productId: number) => {
  const findedCart = await prisma.cart.findFirst({
    where: {
      productId,
      AND: {
        userId,
      },
    },
  })

  if (!findedCart) {
    throw createHttpError(404, 'Cart not found')
  }

  const deletedCart = await prisma.cart.delete({
    where: {
      id: findedCart.id,
      productId,
      AND: {
        userId,
      },
    },
  })

  return deletedCart
}

interface ICartService {
  addProduct: (productId: number) => Promise<void>
}

class CartService implements ICartService {
  async addProduct(productId: number){{
    return
  }} 
}

const cartService = new CartService() 

cartService.addProduct(1)

export default {
  addProductToCard,
  removeProductFromCart,
  getUserCart,
  clearUserCart,
  deleteProductFromCart,
}
