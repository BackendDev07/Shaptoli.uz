import createHttpError from 'http-errors'
import prisma from '../prisma/prisma.service'

const createCategory = async (name: string) => {
  const findedCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  })

  if (findedCategory) {
    throw createHttpError(400, 'Category name already exists')
  }

  const newCategory = await prisma.category.create({
    data: {
      name,
    },
  })

  return newCategory
}

const getAllCategory = async () => {
  const categories = await prisma.category.findMany()
  return categories
}

const getCategoryById = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          Product: true,
        },
      },
    },
  })

  if (!category) {
    throw createHttpError(404, 'Category not found')
  }

  const _category = {
    id: category.id,
    name: category.name,
    productCount: category._count.Product,
  }

  return _category
}

const getProductsByCategory = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      Product: true,
    },
  })

  if (!category) {
    throw createHttpError(404, 'Category not found')
  }

  return {
    id: category.id,
    name: category.name,
    products: category.Product,
  }
}


const updateCategory = async (id: number, name: string) => {
  const findedCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  })

  if (!findedCategory) {
    throw createHttpError(404, 'Category not found!')
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
    },
  })

  return updatedCategory
}

const deleteCategory = async (id: number) => {
  const findedCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  })

  if (!findedCategory) {
    throw createHttpError(404, 'Category not found')
  }

  const deletedCategory = await prisma.category.delete({
    where: {
      id,
    },
  })
  return deletedCategory
}

export default {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
}
