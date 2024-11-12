const categoryModel = require("../models/category.model")

class CategoryController {
    static CategoryInsert = async (req, res) => {
        try {
            const { categoryName, icon } = req.body;

            if (!categoryName) {
                return res.status(400).json({ message: "Category name is required." });
            }

            const savedCategory = await categoryModel.create({ categoryName, icon });

            res.status(201).json({
                message: "Category added successfully",
                data: savedCategory,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to add category",
                error: error.message,
            });
        }
    };

    static DeleteCategory = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Id not found!" });
            }
            await categoryModel.findByIdAndDelete(id);
            return res.status(200).json({ message: "Category deleted successfull" });
        } catch (error) {
            res.send(error)
        }
    };

    static CategorygetAll = async (req, res) => {
        try {
            const data = await categoryModel.find();
            res.status(200).json({
                data,
            });
        } catch (error) {
            res.send(error);
        }
    };

    static Categoryviewbyid = async (req, res) => {
        try {
            const { id } = req.params;
            const categories = await categoryModel.findById(id);
            if (!categories) {
                return res.status(404).json({ message: "category  not found" });
            }
            res.status(200).json(categories);
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ status: "failed", message: error.message });
        }
    };
}
module.exports = CategoryController