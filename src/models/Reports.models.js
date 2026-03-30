import mongoose from "mongoose"
import { atlasConnection } from "../database/dbconnect"

const ReportSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    date:{
        type:Date,
        default:null
    },
    summary:{
        type:String,
        required:true,
        trim:true,
    },
    relatedtasks:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Task"
    }],
    subtasks:[{
           title:{
            type:String,
            default:""
           },
        }],
    // attachements:{
    //     files:[{
    //         type:String,
    //         default:"",
    //     }],
    //     links:[
    //         {
    //             type:String,
    //             default:""
    //         }
    //     ]
    // },
    deleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export const Report = new atlasConnection.model("Report",ReportSchema)