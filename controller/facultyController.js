import Faculty from '../models/faculty.js'
import Test from '../models/test.js'
import Student from '../models/student.js'
import Subject from '../models/subject.js'
import Marks from '../models/marks.js'
import Attendence from '../models/attendance.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const facultyLogin = async (req, res) => {
    const { username, password } = req.body
    const errors = { usernameError: String, passwordError: String }
    try {
        const existingFaculty = await Faculty.findOne({ email:username })
        if (!existingFaculty) {
            errors.usernameError = "Faculty doesn't exist."
            return res.status(404).json(errors)
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingFaculty.password
        )
        if (!isPasswordCorrect) {
          errors.passwordError = "Invalid Credentials";
          return res.status(404).json(errors);
        }

        const token = jwt.sign(
            {
                email: existingFaculty.email,
                id: existingFaculty._id,
            },
            'sEcReT',
            { expiresIn: '10h' }
        )

        res.status(200).json({ result: existingFaculty, token: token })
    } catch (error) {
        console.log(error)
    }
}

export const updatedPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword, email } = req.body
        const errors = { mismatchError: String }
        if (newPassword !== confirmPassword) {
            errors.mismatchError =
                'Your password and confirmation password do not match'
            return res.status(400).json(errors)
        }

        const faculty = await Faculty.findOne({ email })
        let hashedPassword
        hashedPassword = await bcrypt.hash(newPassword, 10)
        faculty.password = hashedPassword
        await faculty.save()
        if (faculty.passwordUpdated === false) {
            faculty.passwordUpdated = true
            await faculty.save()
        }

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            response: faculty,
        })
    } catch (error) {
        const errors = { backendError: String }
        errors.backendError = error
        res.status(500).json(errors)
    }
}

export const updateFaculty = async (req, res) => {
    try {
        const {
            name,
            dob,
            department,
            contactNumber,
            avatar,
            email,
            designation,
        } = req.body
        const updatedFaculty = await Faculty.findOne({ email })
        if (name) {
            updatedFaculty.name = name
            await updatedFaculty.save()
        }
        if (dob) {
            updatedFaculty.dob = dob
            await updatedFaculty.save()
        }
        if (department) {
            updatedFaculty.department = department
            await updatedFaculty.save()
        }
        if (contactNumber) {
            updatedFaculty.contactNumber = contactNumber
            await updatedFaculty.save()
        }
        if (designation) {
            updatedFaculty.designation = designation
            await updatedFaculty.save()
        }
        if (avatar) {
            updatedFaculty.avatar = avatar
            await updatedFaculty.save()
        }
        res.status(200).json(updatedFaculty)
    } catch (error) {
        const errors = { backendError: String }
        errors.backendError = error
        res.status(500).json(errors)
    }
}

export const createTest = async (req, res) => {
    try {
        const {
            subjectCode,
            department,
            year,
            section,
            date,
            test,
            totalMarks,
        } = req.body
        //console.log(req.body)
        const errors = { testError: String }
        const existingTest = await Test.findOne({
            subjectCode,
            department,
            year,
            section,
            test,
        })
        if (existingTest) {
            errors.testError = 'Given Test is already created'
            return res.status(400).json(errors)
        }

        const newTest = await new Test({
            totalMarks,
            section,
            test,
            date,
            department,
            subjectCode,
            year,
        })

        await newTest.save()
        const students = await Student.find({ department, year, section })
        return res.status(200).json({
            success: true,
            message: 'Test added successfully',
            response: newTest,
        })
    } catch (error) {
        const errors = { backendError: String }
        errors.backendError = error
        res.status(500).json(errors)
    }
}

export const getTest = async (req, res) => {
    try {
        const { department, year, section } = req.body

        const tests = await Test.find({ department, year, section })

        res.status(200).json({ result: tests })
    } catch (error) {
        const errors = { backendError: String }
        errors.backendError = error
        res.status(500).json(errors)
    }
}

export const getStudent = async (req, res) => {
    try {
        const { department,batch,year,section,id,courseCode} = req.body
        console.log(req.body);
        const errors = { noStudentError: String }
        const students = await Student.find({department,batch,stuId:id})
        const subject = await Subject.find({year,term:section})
        const rslt = await Test.find({department,year,term:section,id,code:courseCode})
        if (students.length === 0) {
            errors.noStudentError = 'No Student Found'
            return res.status(404).json(errors)
        }

        res.status(200).json({ result: students,subject:subject,rslt:rslt })
    } catch (error) {
        const errors = { backendError: String }
        errors.backendError = error
        res.status(500).json(errors)
    }
}

export const uploadMarks = async (req, res) => {
    try {
        const {name,fristEx,secondEx,ThirdEx,CtAtt,department,year,term,id,code} = req.body
        console.log(req.body)
        const exitsResult=await Test.find({id,code,year,term})
        const query = {
            $and: [
              { id: id },
              { code: code},
              { year: year},
              { term: term},
              // Add more conditions as needed
            ],
          };
        if(exitsResult){
            const update = {
                $set: {
                  fristEx:fristEx,
                  secondEx:secondEx,
                  ThirdEx:ThirdEx,
                  CtAtt:CtAtt,
                  // ...
                },
              };
            await Test.updateOne(query, update);
           return res.status(200).json({ message: 'Marks updated successfully' })
        }else{
            const markUpload = await new Test(req.body)
            const savedata=  await markUpload.save()
            res.status(200).json({ message: 'Marks uploaded successfully' })
        }
        
        
    } catch (error) {
        const errors = { backendError: String }
        errors.backendError = error
        console.log(errors)
        res.status(200).json(errors)
    }
}

export const markAttendance = async (req, res) => {
    try {
        const { selectedStudents, subjectName, department, year, section } =
            req.body

        const sub = await Subject.findOne({ subjectName })

        const allStudents = await Student.find({ department, year, section })

        for (let i = 0; i < allStudents.length; i++) {
            const pre = await Attendence.findOne({
                student: allStudents[i]._id,
                subject: sub._id,
            })
            if (!pre) {
                const attendence = new Attendence({
                    student: allStudents[i]._id,
                    subject: sub._id,
                })
                attendence.totalLecturesByFaculty += 1
                await attendence.save()
            } else {
                pre.totalLecturesByFaculty += 1
                await pre.save()
            }
        }

        for (var a = 0; a < selectedStudents.length; a++) {
            const pre = await Attendence.findOne({
                student: selectedStudents[a],
                subject: sub._id,
            })
            if (!pre) {
                const attendence = new Attendence({
                    student: selectedStudents[a],
                    subject: sub._id,
                })

                attendence.lectureAttended += 1
                await attendence.save()
            } else {
                pre.lectureAttended += 1
                await pre.save()
            }
        }
        res.status(200).json({ message: 'Attendance Marked successfully' })
    } catch (error) {
        const errors = { backendError: String }
        errors.backendError = error
        res.status(500).json(errors)
    }
}
