import mongoose from "mongoose";

const ApplicantSchema = mongoose.Schema({
   name:{
    type:String,
    required:true,
    trim:true,
   },
   email:{
    type:String,
    required:true,
    trim:true,
    unique:true
   },
   resumelink:{
      type:String,
      required:true,
   },
   linkedin:{
      type:String,
      required:true,
   },
   github:{
      type:String,
   },
   phonenumber:{
    type:Number,
    required:true,
   },
   dob:{
        type:Date,
        default:"",
    },
    gender:{
        type:String,
        default:""
    },
   other:[{
      type:String,
   }]
},{timestamps:true})

export const Applicant = new mongoose.model("Applicant",ApplicantSchema)