import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { HobbyModel } from '../models/Hobbies.js'
import { UserModel } from '../models/Users.js'
import multer from 'multer'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const response = await HobbyModel.find({})
    res.json(response)
  } catch (err) {
    res.json(err)
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)
  const hobby = new HobbyModel(req.body)
  try {
    const response = await hobby.save()
    res.status(200)
    res.json(response)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
})

router.put('/', async (req, res) => {
  try {
    const hobby = await HobbyModel.findById(req.body.hobbyID)
    const user = await UserModel.findById(req.body.userID)
    // console.log("hobby.hobbyName")
    user.hobbies.push(hobby)
    hobby.userList.push(user)
    await hobby.save()
    await user.save()
    res.json(hobbies)
  } catch (err) {
    res.json(err)
  }
})

// LIST OF ALL THE HOBBIES OF A USER
router.get('/interestedHobbies/:userID', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID)
    const hobbies = await HobbyModel.find({
      _id: { $in: user.hobbies },
    })
    res.json({ hobbies: hobbies })
  } catch (err) {
    res.json(err)
  }
})

// REMOVE HOBBY OF A USER
router.put('/:hobbyID/user/:userID', async (req, res) => {
  try {
    const hobby = await HobbyModel.findById(req.params.hobbyID)
    const user = await UserModel.findById(req.params.userID)
    // console.log("hobby.hobbyName")
    const userIndex = hobby.userList.indexOf(req.params.userID)
    const hobbyIndex = user.hobbies.indexOf(req.params.hobbyID)

    if (userIndex > -1) {
      hobby.userList.splice(userIndex, 1)
    }
    if (hobbyIndex > -1) {
      user.hobbies.splice(hobbyIndex, 1)
    }
    await hobby.save()
    await user.save()
    res.json(hobbies)
  } catch (err) {
    res.json(err)
  }
})

export { router as hobbiesRouter }
