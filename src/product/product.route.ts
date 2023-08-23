import { Router } from 'express'
import upload from '../common/uploadFile.middleware'
import productController from './product.controller'
import { userVerify } from '../common/user-verify.middleware'
import bodyValidate from './../common/body-validate.middleware'
import productModel from './product.model'

const router = Router()

router.post(
  '/',
  userVerify(['admin']),
  upload.single('img'),
  bodyValidate(productModel.createProduct),
  productController.createProduct
)
router.put(
  '/:id',
  userVerify(['admin']),
  upload.single('img'),
  bodyValidate(productModel.updateProduct),

  productController.updateProduct
)
router.delete('/:id', userVerify(['admin']), productController.deleteProduct)
router.get('/:id', productController.getProductById)
router.post(
  '/:id/image',
  userVerify(['admin']),
  upload.single('img'),
  productController.createImage
)
router.delete(
  '/image/:id',
  userVerify(['admin']),
  productController.deleteImage
)

router.post(
  '/:id/detail',
  userVerify(['admin']),
  bodyValidate(productModel.createDetail),
  productController.createDetail
)
router.put(
  '/detail/:id',
  userVerify(['admin']),
  bodyValidate(productModel.updateDetail),

  productController.updateDetail
)
router.delete(
  '/detail/:id',
  userVerify(['admin']),
  productController.deleteDetail
)

router.post('/:id/review', userVerify(['user']), productController.createReview)

export default router
