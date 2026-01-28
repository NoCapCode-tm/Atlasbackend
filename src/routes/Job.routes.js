import {Router} from "express"
import { applyForJob, createJob, getAllJobs, getJobApplicants } from "../controller/Job.controller.js"

const jobrouter = Router()


//post apis
jobrouter.route("/create").post(createJob)
jobrouter.route("/apply").post(applyForJob)


//post apis
jobrouter.route("/getjobs").get(getAllJobs)
jobrouter.route("/getapplicants").get(getJobApplicants)

export {jobrouter}


