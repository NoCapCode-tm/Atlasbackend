import mongoose from "mongoose"
import { atlasConnection } from "../database/dbconnect.js"

const SubtaskSchema = mongoose.Schema({
    relatedtasks:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    },
    title:{
        type:String,
        default:"",
    },
    description:{
        type:String,
        default:"",
    },
    completedAt:{
        type:Date,
        default:null,
    },
    createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Subtask =  atlasConnection.model("Subtask",SubtaskSchema)