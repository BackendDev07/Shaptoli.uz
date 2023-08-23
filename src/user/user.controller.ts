import { ControllerType } from '../common/types'
import userService from './user.service'

const getAllUsers: ControllerType = async (req, res, next) => {
  try {
    const { verified } = req.query

    const verifiedBool = verified ? JSON.parse(String(verified)) : undefined

    const users = await userService.getAllUser(verifiedBool)

    res.send({
      message: 'All Users',
      users,
    })
  } catch (e) {
    next(e)
  }
}

const getAllAdmins: ControllerType = async (req, res, next) => {
  try {
    const admins = await userService.getAllAdmins()

    res.send({
      message: "All admins",
      admins
    })
  } catch (err) {
    next(err)
  }
}

const toggleAdmin: ControllerType = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await userService.toggleAdmin(+id)

    res.send({
      message: "Toggle admin",
      user
    })
  } catch (err) {
    next(err)
  }
}

const deleteUsers: ControllerType = async (req, res, next) => {
  try {
    const count = await userService.deleteUsers()

    res.send({
      message: "User deleted",
      count
    })
  } catch (err) {
    next(err)
  }
}

export default {
  getAllUsers,
  getAllAdmins,
  toggleAdmin,
  deleteUsers
}
