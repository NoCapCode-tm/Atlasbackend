import { Job } from "../models/Job.models.js";
import { Apierror } from "../utils/Apierror.utils.js";
import { Apiresponse } from "../utils/Apiresponse.utils.js";
import { asynchandler } from "../utils/Asynchandler.utils.js";

import { Applicant } from "../models/Applicant.models.js";

export const createJob =asynchandler(async (req, res) => {
  try {
    const {
      title,
      description,
      responsibilities,
      mode,
      department,
      perks,
      whoshouldapply,
      employementtype,
    } = req.body;

    if (
      !title ||
      !description ||
      !responsibilities ||
      !mode ||
      !department ||
      !perks ||
      !whoshouldapply ||
      !employementtype
    ) {
      throw new Apierror(400,"Please fill all the required Fields")
    }

    const job = await Job.create({
      title,
      description,
      responsibilities,
      mode,
      department,
      perks,
      whoshouldapply,
      employementtype,
    });

     res.status(201)
     .json(new Apiresponse(200,"Job Posting Added Successfully",job));
  } catch (error) {
     console.log("Something Went Wrong",error)
  }
});

export const applyForJob = asynchandler(async (req, res) => {
  try {
    const {
      name,
      email,
      resumelink,
      linkedin,
      github,
      phonenumber,
      dob,
      gender,
      other,
      jobId,
    } = req.body;

    if (!jobId) {
      throw new Apierror(400,"Please fill all the required fields")
    }

    if (!name || !email || !resumelink || !linkedin || !phonenumber) {
      throw new Apierror(400,"Mandatory Fields Empty")
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new Apierror(404,"Job Posting Not Found")
    }

    
    const existingApplicant = await Applicant.findOne({ email });
    if (existingApplicant) {
     throw new Apierror(500,"Applicant already exists")
    }

    const applicant = await Applicant.create({
      name,
      email,
      resumelink,
      linkedin,
      github,
      phonenumber,
      dob,
      gender,
      other,
    });

    job.applicants.push(applicant._id);
    await job.save();

    res.status(201)
    .json(new Apiresponse(200,"Applicant applied Successfully"));
  } catch (error) {
    console.log("Something Went Wrong",error)
  }
});


export const getAllJobs = asynchandler(async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    req.status(200)
    .json(new Apiresponse(201,"All job Fetched Successfully"))
  } catch (error) {
    console.log("Something Went Wrong",error)
  }
});


export const getJobApplicants = asynchandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("applicants");

    if (!job) {
      throw new Apierror(404,"No Job Opening Found")
    }

    req.status(200
        .json(new Apiresponse(201,"Applicants fetched Successfully",job.applicants))
    )
  } catch (error) {
    console.log("Something Went Wrong",error)
  }
});
