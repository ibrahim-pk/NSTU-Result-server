import express from 'express'
import {
    studentLogin,
    updatedPassword,
    updateStudent,
    testResult,
    attendance,
    resetPassword,
} from '../controller/studentController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/login', studentLogin)
router.post('/updatepassword', auth, updatedPassword)
router.put('/resetpassword', resetPassword)
router.post('/updateprofile', auth, updateStudent)
router.post('/testresult', auth, testResult)
router.post('/attendance', auth, attendance)

export default router
