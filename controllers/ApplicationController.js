const applicationModel = require("../models/application.model");
const jobModel = require("../models/job.model");
const cloudinary = require("cloudinary").v2;

class ApplicationController {
    static applying = async (req, res) => {
        try {
            const { role } = req.userData;
            if (role === "employer") {
                res.status(400).json({
                    status: "failed",
                    message: "Employer not alowed to access this resource",
                });
            }
            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).json({
                    status: "failed",
                    message: "Resume file Required.",
                });
            }
            const { resume } = req.files;
            const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp", "application/pdf"];
            if (!allowedFormats.includes(resume.mimetype)) {
                res.status(400).json({
                    status: "failed",
                    message: "Invalid file type.Please upload a pdf/png/jpeg/webp file.",
                });
            }
            const cloudinaryResponse = await cloudinary.uploader.upload(
                resume.tempFilePath
            );

            if (!cloudinaryResponse || cloudinaryResponse.err) {
                console.err(
                    "cloudinary Error:",
                    cloudinaryResponse.err || "unknown cloudinary err"
                );

                res.status(400).json({
                    status: "failed",
                    message: "failed to upload Resume to Clodinary",
                });
            }
            const { name, email, coverLetter, phone, address, jobId } = req.body;
            const applicantID = {
                user: req.userData._id,
                role: "jobSeeker",
            };
            console.log(applicantID)
            if (!jobId) {
                res.status(400).json({
                    status: "failed",
                    message: "Job not found",
                });
            }
            const jobDetails = await jobModel.findById(jobId);
            if (!jobDetails) {
                res.status(400).json({
                    status: "failed",
                    message: "Job not found",
                });
            }
            const employerID = {
                user: jobDetails.postedBy,
                role: "employer",
            };
            console.log(employerID)
            if (
                !name ||
                !email ||
                !coverLetter ||
                !phone ||
                !address ||
                !applicantID ||
                !employerID ||
                !resume
            ) {
                res.status(400).json({
                    status: "failed",
                    message: "please fill all fields",
                });
            }
            const application = await applicationModel.create({
                name,
                email,
                coverLetter,
                phone,
                address,
                applicantID,
                employerID,
                resume: {
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                },
            });
            res.status(200).json({
                success: true,
                message: "Application submitted!",
                application,
            });
        } catch (err) {
            console.log(err);
        }
    };
    static employerGetApplicant = async (req, res) => {
        try {
            const { role, _id } = req.userData;
            if (role === "jobSeeker") {
                return res.status(400).json({
                    status: "failed",
                    message: "Job seekers are not authorized to access this resource!",
                });
            }

            const applications = await applicationModel.find({ "employerID.user": _id });
            res.status(200).json({ status: "success", applications });
        } catch (error) {
            console.error("Error fetching applicants:", error);
            res.status(500).json({ status: "error", message: "Server error!" });
        }
    };
    static jobSeekerGetApplications = async (req, res) => {
        try {
            const { role, _id } = req.userData;
            if (role === "employer") {
                return res.status(400).json({
                    status: "failed",
                    message: "Employers are not allowed to access this resource.."
                })
            }

            const applications = await applicationModel.find({ "applicantID.user": _id });
            res.status(200).json({
                success: true, applications,
            })
        } catch (error) {
            console.error("Error fetching applicants:", error);
            res.status(500).json({ status: "error", message: "Server error!" });
        }
    };
    static deleteApplication = async (req, res) => {
        try {
            const { role } = req.userData
            if (role === "employer") {
                return res.status(400).json({
                    status: "failed",
                    message: "Employer is not allowed to access this resource"
                })
            }
            const { id } = req.params.id
            const application = await applicationModel.findById(id)
            if (!application) {
                return res.status(400).json({ success: "failed", message: "Application not Found!" })
            }
            await applicationModel.deleteOne()
            res.status(200).json({ success: true, message: "Application deleted" })
        } catch (error) {
            console.error("Error fetching applicants:", error);
            res.status(500).json({ status: "error", message: "Server error!" });
        }
    }
}
module.exports = ApplicationController;
