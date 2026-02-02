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

      const resend = new Resend(process.env.RESEND_API_KEY);
             await resend.emails.send({
          from: `Atlas <${process.env.SMTP_USER}>`,
          to: [email],
          subject: "Application Submitted Successfully | NoCapCode",
         html: `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Application Received</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#F4F6F8;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:48px 16px;">

  <!-- Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="
    max-width:640px;
    background:#FFFFFF;
    border-radius:12px;
    box-shadow:0 12px 32px rgba(0,0,0,0.08);
    overflow:hidden;
  ">

    <!-- Header -->
    <tr>
      <td style="
        padding:32px;
        background:#0F1115;
        text-align:center;
      ">
        <img
          src="https://nocapcode.cloud/Companylogo.png"
          alt="NoCapCode"
          width="125"
          style="display:block; margin:0 auto 12px;"
        />

        <h1 style="
          margin:0;
          font-size:20px;
          font-weight:600;
          color:#FFFFFF;
          letter-spacing:0.3px;
        ">
          Application Received
        </h1>

        <p style="
          margin:8px 0 0;
          font-size:12px;
          color:#B6BBC7;
        ">
          NoCapCode™ · Talent Acquisition
        </p>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding:36px; color:#1F2937;">

        <!-- Greeting -->
        <p style="margin:0 0 18px; font-size:14.5px;">
          Dear <strong>${name.split(" ")[0]}</strong>,
        </p>

        <!-- Confirmation -->
        <p style="margin:0 0 18px; font-size:14.5px; line-height:1.7;">
          Thank you for your interest in opportunities at <strong>NoCapCode™</strong>.
          This email is to confirm that we have received your application for the
          <strong>${job.department}</strong> position.
        </p>

        <!-- Application Type -->
        <p style="margin:0 0 18px; font-size:14.5px; line-height:1.7;">
          <strong>Application Type:</strong> ${job.employmenttype}
        </p>

        <!-- Review Process -->
        <p style="margin:0 0 18px; font-size:14.5px; line-height:1.7;">
          Due to the volume of applications we receive, our Talent Acquisition team
          carefully reviews each profile against role requirements.
          If your qualifications and experience align with our current needs,
          a member of our team will contact you regarding the next steps.
        </p>

        <!-- Next Steps -->
        <table width="100%" cellpadding="0" cellspacing="0" style="
          background:#F9FAFB;
          border-radius:10px;
          padding:20px;
          border:1px solid #E5E7EB;
        ">
          <tr>
            <td>
              <p style="margin:0 0 10px; font-size:13px; font-weight:600;">
                What happens next
              </p>
              <ul style="margin:0; padding-left:18px; font-size:13.5px; line-height:1.7;">
                <li>Your application will be reviewed by our Talent Acquisition team</li>
                <li>Shortlisted candidates will be contacted via email</li>
                <li>Review timelines may vary depending on the role and application volume</li>
              </ul>
            </td>
          </tr>
        </table>

        <!-- Closing -->
        <p style="margin:22px 0 0; font-size:14px; line-height:1.7;">
          We appreciate the time and effort you have taken to apply and
          your interest in NoCapCode™.
        </p>

        <p style="margin:18px 0 0; font-size:14px;">
          Sincerely,<br/>
          <strong>Talent Acquisition Team</strong><br/>
          NoCapCode™
        </p>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="
        padding:24px 32px;
        background:#F9FAFB;
        border-top:1px solid #E5E7EB;
        text-align:center;
      ">
        <p style="margin:0; font-size:11.5px; color:#6B7280; line-height:1.6;">
          This is a system-generated email. Please do not reply to this message.
          <br/>
          Only shortlisted candidates will be contacted for further communication.
          <br/><br/>
          <strong>NoCapCode™</strong> · Talent Acquisition & Careers
        </p>
      </td>
    </tr>

  </table>

  <p style="margin-top:22px; font-size:11px; color:#9CA3AF; text-align:center;">
    This email contains confidential information intended solely for the recipient.
  </p>

</td>
</tr>
</table>

</body>
</html>
      `
        });

    res.status(201)
    .json(new Apiresponse(200,"Applicant applied Successfully"));
});


export const getAllJobs = asynchandler(async (req, res) => {
  
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200)
    .json(new Apiresponse(201,"All job Fetched Successfully",jobs))
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
