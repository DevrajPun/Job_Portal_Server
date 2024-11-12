const express = require("express")
const UserController = require("../controllers/userController")
const JobController = require("../controllers/JobController")
const verifyToken = require("../middleware/verifyToken")
const ApplicationController = require("../controllers/ApplicationController")
const CategoryController = require("../controllers/CategoryController")
const UploaderController = require("../controllers/UploaderController")
const route = express.Router()

// user routes
route.post('/signUp', UserController.signUp)
route.post('/signIn', UserController.signIn)
route.get("/getUser", verifyToken, UserController.getUserDetails)
route.get('/signOut', UserController.signOut)

// jobs route
route.post("/jobPost", verifyToken, JobController.jobPosting)
route.get("/employerJobs", verifyToken, JobController.getEmployerJobs)
route.get("/jobList", verifyToken, JobController.getAllJobs)
route.get("/job/:id", verifyToken, JobController.getJobById)
route.get("/delete/:id", verifyToken, JobController.deleteJob)
route.post("/update/:id", verifyToken, JobController.updateJob)

//applicant route
route.post("/applying", verifyToken, ApplicationController.applying)
route.get("/employer/getApplicants", verifyToken, ApplicationController.employerGetApplicant)
route.get("/applicant/getApplicants", verifyToken, ApplicationController.jobSeekerGetApplications)
route.get("/deleteApplication/:id", verifyToken, ApplicationController.deleteApplication)

// category route
route.post("/categoryInsert", verifyToken, CategoryController.CategoryInsert)
route.get("/categoryDelete", verifyToken, CategoryController.DeleteCategory)
route.get("/categoryViewAll", verifyToken, CategoryController.CategorygetAll)
route.get("/categoryView/:id", verifyToken, CategoryController.Categoryviewbyid)


// uploader routes
route.post("/techUpload", UploaderController.techUploader)

module.exports = route