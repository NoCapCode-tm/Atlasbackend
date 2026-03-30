import mongoose from "mongoose"
import { atlasConnection } from "../database/dbconnect"

const CaseSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    subtitle:{
        type:String,
        required:true
    },
    thumbnail:{
       type:String,
       required:true
    },
    content:{
        type:String,
       required:true
    }
},{timestamps:true})

export const Case = new atlasConnection.model("Case",CaseSchema)