const uploaderModel = require("../models/uploader.model");

const cloudinary = require("cloudinary").v2;

class UploaderController {
    static techUploader = async (req, res) => {
        try {
            const { title, desc } = req.body;

            if (!req.files || !req.files.img) {
                return res.status(400).json({
                    status: "failed",
                    message: "Image file is required",
                });
            }

            const { img } = req.files;

            if (!title || !desc) {
                return res.status(400).json({
                    status: "failed",
                    message: "Please fill all fields",
                });
            }

            const cloudinaryResponse = await cloudinary.uploader.upload(img.tempFilePath);
            if (!cloudinaryResponse || cloudinaryResponse.error) {
                console.error(
                    "Cloudinary Error:",
                    cloudinaryResponse.error || "unknown cloudinary error"
                );
                return res.status(400).json({
                    status: "failed",
                    message: "Failed to upload image to Cloudinary",
                });
            }

            const data = await uploaderModel.create({
                title,
                desc,
                img: {
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                },
            });

            // Respond with success
            res.status(200).json({
                success: true,
                message: "Task submitted successfully!",
                data,
            });

        } catch (error) {
            console.error("Server Error:", error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    };
}
module.exports = UploaderController