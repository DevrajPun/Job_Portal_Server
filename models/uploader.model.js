const mongoose = require("mongoose")
const uploaderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    img: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
},
    { timestamps: true }
)
const uploaderModel = mongoose.model("uploader.model", uploaderSchema);
module.exports = uploaderModel;