import { Job } from "../models/Job.models.js";
import { Apierror } from "../utils/Apierror.utils.js";
import { Apiresponse } from "../utils/Apiresponse.utils.js";
import { asynchandler } from "../utils/Asynchandler.utils.js";

import { Applicant } from "../models/Applicant.models.js";
import { Case } from "../models/CaseStudies.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";

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
      noofapplicants
    } = req.body;

    if (
      !title ||
      !description ||
      !responsibilities ||
      !mode ||
      !department ||
      !perks ||
      !whoshouldapply ||
      !employementtype ||
      !noofapplicants
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
      noofapplicants
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
      jobtitle:job.title
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

    res.status(200)
    .json(new Apiresponse(201,"All job Fetched Successfully",jobs))
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

    res.status(200
        .json(new Apiresponse(201,"Applicants fetched Successfully",job.applicants))
    )
  } catch (error) {
    console.log("Something Went Wrong",error)
  }
});

export const addcasestudy = asynchandler(async(req,res)=>{
  const{head,subhead,content}=req.body;
  

  if(!head ||!subhead || !content){
    throw new Apierror(400,"Please fill all the required fields")
  }

  let thumbnail = ""

  if (req.files?.thumbnail?.length > 0){
    const upload = await uploadToCloudinary(
              req.files.thumbnail[0].buffer,
              "case-study/thumbnail"
            );
      thumbnail = upload.secure_url
  }

  const casestudy = await Case.create({
    title:head,
    subtitle:subhead,
    thumbnail:thumbnail,
    content:content
  })

  res.status(200)
  .json(new Apiresponse(200,"Case study Added Successfully",casestudy))
})

export const getcasestudy = asynchandler(async(req,res)=>{
  const casestudy = await Case.find()

  if(!casestudy.length){
    throw new Apierror(404,"No Case Study Found")
  }

  res.status(200)
  .json(new Apiresponse(201,"Case Study Fetched Successfully",casestudy))
})

export const adminlogin = asynchandler(async(req,res)=>{
    const{userid,password} = req.body

  if(!userid || !password){
    throw new Apierror(400,"Please fill all the required Details")
  }

  if(userid === process.env.ADMIN_LOGIN_ID  && password === process.env.ADMIN_PASSWORD){
   res.status(200)
  .json(new Apiresponse(201,"Login Successfull"))
  }else{
    throw new Apierror(401,"Unauthorized Access")
  }
  
})
