const jobModel = require("../models/job.model")

class JobController {

    static jobPosting = async (req, res) => {
        const { role } = req.userData;
        if (role === "employer") {
            try {
                const { title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo } = req.body;

                // Check required fields
                if (!title || !description || !category || !country || !city || !location) {
                    return res.status(400).json({ status: "failed", message: "All fields are required!" });
                }

                // Check salary inputs
                if ((!salaryFrom || !salaryTo) && !fixedSalary) {
                    return res.status(400).json({ status: "failed", message: "Please provide either salary range or fixed salary." });
                }

                if ((salaryFrom && salaryTo) && fixedSalary) {
                    return res.status(400).json({ status: "failed", message: "Provide either salary range or fixed salary, not both." });
                }

                // Job posting logic
                const postedBy = req.userData._id;
                const jobPost = await jobModel.create({
                    title, description, category, country, city, location, salaryFrom, salaryTo, fixedSalary, postedBy
                });

                // Respond with success
                return res.status(200).json({ status: "success", message: "Job posted successfully.", jobPost });

            } catch (error) {
                console.error(error);
                return res.status(500).json({ status: "failed", message: "Internal server error" });
            }
        }
        // If user is not an employer
        return res.status(403).json({ status: "failed", message: "You are not authorized to post a job!" });
    };

    static getJobById = async (req, res) => {
        try {
            const { id } = req.params
            if (!id) {
                return res.status(400).json({ status: "failed", message: "Job not found" })
            }
            const data = await jobModel.findById(id)
            return res.status(200).json({ status: "success", data })
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ status: "failed", message: "Internal server error" })
        }
    }

    static getEmployerJobs = async (req, res) => {
        try {
            const { role } = req.userData
            if (role === "jobSeeker") {
                return res.status(400).json({ status: "failed", message: "You are not authorized to access this data" })
            }
            const jobs = await jobModel.find({ postedBy: req.userData._id })
            return res.status(200).json({ status: "success", message: `Jobs Posted by ${req.userData.name} `, jobs })
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ status: "failed", message: "Internal server error." })
        }
    }

    static getAllJobs = async (req, res) => {
        try {
            const jobList = await jobModel.find();
            return res.status(200).json({
                status: "success",
                message: "List of jobs",
                data: jobList
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                message: "Internal server error."
            });
        }
    };

    static updateJob = async (req, res) => {
        try {
            const { role } = req.userData;

            if (role === "jobSeeker") {
                return res.status(403).json({ status: "failed", message: "You are not authorized to update jobs" });
            }

            const { id } = req.params;

            const job = await jobModel.findById(id);

            if (!job) {
                return res.status(404).json({ status: "failed", message: "Job not found" });
            }

            const updatedJob = await jobModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });

            return res.status(200).json({ status: "success", message: "Job updated successfully", updatedJob });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ status: "failed", message: "Internal server error" });
        }
    }

    static deleteJob = async (req, res) => {
        try {
            const { id } = req.params
            if (!id) {
                return res.status(400).json({ status: "failed", message: "Job not found" })
            }
            await jobModel.findByIdAndDelete(id)
            return res.status(200).json({ status: "success", message: "Job deleted successfully" })
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ status: "failed", message: "Internal server error." })
        }
    }

}
module.exports = JobController