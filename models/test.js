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
    subTitle: {
        type: String,
    },
    code: {
        type: String,
        required: true,
    },
    credit: {
        type: String,
        
    },
    fristEx: {
        type: String,
        default: "0"
        
        
    },
    secondEx: {
        type: String,
        default: "0"
        
    },
    ThirdEx: {
        type: String,
        default: "0"
        
    },
    CtAtt: {
        type: String,
        default: "0"
        
    }
})

export default mongoose.model('test', testSchema)
