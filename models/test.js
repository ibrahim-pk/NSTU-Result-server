import mongoose from 'mongoose'

const testSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    year: {
        type: String,
    },
    term: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    fristEx: {
        type: String,
        
    },
    secondEx: {
        type: String,
        
    },
    ThirdEx: {
        type: String,
        
    },
    CtAtt: {
        type: String,
        
    }
})

export default mongoose.model('test', testSchema)
