import express from 'express'
import {
    facultyLogin,
    updatedPassword,
    updateFaculty,
    createTest,
    getTest,
    getStudent,
    uploadMarks,
    markAttendance,
} from '../controller/facultyController.js'
import auth from '../middleware/auth.js'
import Student from '../models/student.js'
import Test from '../models/test.js'
const router = express.Router()

router.post('/login', facultyLogin)
router.post('/updatepassword', auth, updatedPassword)
router.post('/updateprofile', auth, updateFaculty)
router.post('/createtest', auth, createTest)
router.post('/gettest', auth, getTest)
router.post('/getstudent', auth, getStudent)
router.post('/uploadmarks', auth, uploadMarks)
router.post('/markattendance', auth, markAttendance)

router.get('/getresult/:id', auth,async(req,res)=>{
    try {
        const id=req.params.id
        const errors = { noStudentError: String }

        let student = await Student.find({stuId:id})
        let rslt = await Test.find({id:id})

        // console.log(student);
        // console.log("amar result",rslt);

        if (student.length === 0) {
            errors.noStudentError = 'No Student Found'
            return res.status(404).json(errors)
        }else{
            res.status(200).json({result: student,rslt:rslt})
        }

    } catch (error) {
        const errors = { backendError: String }
        errors.backendError = error
        res.status(500).json(errors)
    }

})

export default router
