const mongoose = require('mongoose')
const CategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
});

const categoryModel = mongoose.model("category.model", CategorySchema);
module.exports = categoryModel;