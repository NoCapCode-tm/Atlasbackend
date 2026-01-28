import {Router} from "express"
import { addcasestudy, applyForJob, createJob, getAllJobs, getJobApplicants } from "../controller/Job.controller.js"
import { upload } from "../middleware/multer.middleware.js"


const jobrouter = Router()


//post apis
jobrouter.route("/create").post(createJob)
jobrouter.route("/apply").post(applyForJob)
jobrouter.route("/addcasestudy").post(upload.fields([
    { name: "thumbnail", maxCount: 1 },]),
    addcasestudy
)


//post apis
jobrouter.route("/getjobs").get(getAllJobs)
jobrouter.route("/getapplicants").get(getJobApplicants)

export {jobrouter}


