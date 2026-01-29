import {Router} from "express"
import { addcasestudy, adminlogin, applyForJob, createJob, getAllJobs, getcasestudy, getJobApplicants } from "../controller/Job.controller.js"
import { upload } from "../middleware/multer.middleware.js"


const jobrouter = Router()


//post apis
jobrouter.route("/create").post(createJob)
jobrouter.route("/apply").post(applyForJob)
jobrouter.route("/adminlogin").post(adminlogin)
jobrouter.route("/addcasestudy").post(upload.fields([
    { name: "thumbnail", maxCount: 1 },]),
    addcasestudy
)


//get apis
jobrouter.route("/getjobs").get(getAllJobs)
jobrouter.route("/getapplicants").get(getJobApplicants)
jobrouter.route("/getallcasestudy").get(getcasestudy)

export {jobrouter}


