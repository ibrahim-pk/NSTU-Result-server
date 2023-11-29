import mongoose from 'mongoose'

const ufacultySchema = mongoose.Schema({
    ufaculty: {
        type: String,
        required: true,
    },
    ufacultyCode:{
        type: String,
        required: true,
        unique: true,
    },
})

const Ufaculty =mongoose.model('ufaculty', ufacultySchema)

export default Ufaculty;
