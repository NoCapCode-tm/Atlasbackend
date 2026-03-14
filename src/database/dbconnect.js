import mongoose from "mongoose"

const connectdb = async() =>{
   try {
    const connectioninstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`)
    const connectioninstance1 = await mongoose.connect(`${process.env.MONGODB_URI1}/${process.env.MONGODB_NAME1}`)
    console.log(`Database Connected /n db host = ${connectioninstance.connection.host}`)
    console.log(`Database Connected /n db host = ${connectioninstance1.connection.host}`)
   } catch (error) {
    console.log("Connection Failed" ,error.message)
   }
}
export {connectdb}