import { NextFunction, Request, Response } from 'express'
import categoryService from './category.service'
import createHttpError from 'http-errors'

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body
    const file = req.file

    if( !file ) {
      throw createHttpError(400, "File not found")
    }

    const category = await categoryService.createCategory({
      name, 
      cover: file.filename
    } )

    res.status(201).send({
      message: 'Category Created',
      category
    })
  } catch (e) {
    next(e)
  }
}

const getAllCategory = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoryService.getAllCategory()
    res.send({
      message: 'All CAtegories',
      categories,
    })
  } catch (e) {
    next(e)
  }
}

const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const category = await categoryService.getProductsByCategory(+id)
    res.send({
      message: 'Products By Category',
      category,
    })
  } catch (e) {
    next(e)
  }
}

const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const category = await categoryService.getCategoryById(+id)

    res.send({
      message: 'Category',
      category,
    })
  } catch (e) {
    next(e)
  }
}

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const file = req.file

    const category = await categoryService.updateCategory(+id, {
      name,
      cover: file?.filename
    })

    res.send({
      message: 'Category Updated',
      category,
    })
  } catch (e) {
    next(e)
  }
}

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const category = await categoryService.deleteCategory(+id)

    res.send({
      message: 'Category Deleted',
      category,
    })
  } catch (e) {
    next(e)
  }
}

export default {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
}
