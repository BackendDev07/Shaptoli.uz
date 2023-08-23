import { NextFunction, Request, Response } from 'express'
import productService from './product.service'
import createHttpError from 'http-errors'
import { ControllerType } from '../common/types'

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, description, categoryId } = req.body
    const file = req.file

    if (!file) {
      throw createHttpError(400, 'File not found')
    }

    const product = await productService.createProduct({
      name,
      price: +price,
      description,
      categoryId: +categoryId,
      cover: file.filename,
    })

    res.status(201).send({
      message: 'Product Created',
      product,
    })
  } catch (e) {
    next(e)
  }
}

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { name, price, categoryId, description } = req.body
    const file = req.file

    const product = await productService.updateProduct(+id, {
      name,
      price: +price || price,
      categoryId: +categoryId || categoryId,
      description,
      cover: file?.filename,
    })

    res.send({
      message: 'Product Updated',
      product,
    })
  } catch (e) {
    next(e)
  }
}

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const deletedProduct = await productService.deleteProduct(+id)
    res.send({
      message: 'Product Deleted',
      product: deletedProduct,
    })
  } catch (e) {
    next(e)
  }
}

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const product = await productService.getProductById(+id)
    res.send({
      message: 'Product Details',
      product,
    })
  } catch (e) {
    next(e)
  }
}

const createImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const file = req.file
    console.log(id)
    if (!file) throw createHttpError(404, 'File not found')

    const image = await productService.createImage(+id, file.filename)

    res.status(201).send({
      message: 'Image created',
      image,
    })
  } catch (e) {
    next(e)
  }
}

const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const image = await productService.deleteImage(+id)

    res.send({
      message: 'Image deleted',
      image,
    })
  } catch (e) {
    next(e)
  }
}

const createDetail: ControllerType = async (req, res, next) => {
  try {
    const { id } = req.params
    const { key, value } = req.body

    const detail = await productService.createDetail(+id, key, value)

    res.status(201).send({
      message: 'Detail Created',
      detail,
    })
  } catch (e) {
    next(e)
  }
}
const updateDetail: ControllerType = async (req, res, next) => {
  try {
    const { id } = req.params
    const { key, value } = req.body

    const detail = await productService.updateDetail(+id, key, value)

    res.send({
      message: 'Detail Updated',
      detail,
    })
  } catch (e) {
    next(e)
  }
}

const deleteDetail: ControllerType = async (req, res, next) => {
  try {
    const { id } = req.params

    const detail = await productService.deleteDetail(+id)
    res.send({
      message: 'Detail Deleted',
      detail,
    })
  } catch (e) {
    next(e)
  }
}

const createReview: ControllerType = async (req, res, next) => {
  try {
    const { comment } = req.body
    const { id } = req.params
    const userId = res.locals.user.id

    const review = await productService.createReview(comment, userId, +id)

    res.status(201).send({
      message: 'Review Created',
      review,
    })
  } catch (e) {
    next(e)
  }
}

export default {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  deleteImage,
  createImage,
  createDetail,
  updateDetail,
  deleteDetail,
  createReview,
}
