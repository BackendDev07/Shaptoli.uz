import { Router } from 'express'
import { userVerify } from '../common/user-verify.middleware'
import userController from './user.controller'

const router = Router()

router.get('/', userVerify(['supervisor']), userController.getAllUsers)

export default router
