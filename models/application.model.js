const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enteer your Name!"]
    },
    email: {
        type: String,
        required: [true, "Please enter your Email!"]
    },
    coverLetter: {
        type: String,
        required: [true, "Please provide cover letter!"]
    },
    phone: {
        type: String,
        required: [true, "Please enter your phone Number!"]
    },
    address: {
        type: String,
        required: [true, "Please enter your Address!"]
    },
    resume: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    applicantID: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user.model",
            required: true
        },
        role: {
            type: String,
            enum: ["jobSeeker"],
            required: true
        }
    },
    employerID: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user.model",
            required: true
        },
        role: {
            type: String,
            enum: ["employer"],
            required: true
        }
    }
}, {
    timestamps: true
})

const applicationModel = mongoose.model("application.model", applicationSchema)
module.exports = applicationModel