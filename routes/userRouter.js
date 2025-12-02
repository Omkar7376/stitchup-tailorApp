const express = require('express')
const { createUser, getUsers, getUserByID, updateUser, deleteUser, login } = require('../controller/userController')
const { checkAuth } = require('../middleware/check_auth')

const userRouter = express.Router()

//User
userRouter.post('/addUser', createUser)
userRouter.post("/login", login)
userRouter.get('/getallusers', getUsers)
userRouter.get('/getuser/:id', getUserByID)
userRouter.put('/updateuser/:id', updateUser)
userRouter.delete('/deleteuser/:id', deleteUser)

module.exports = {
    userRouter
}