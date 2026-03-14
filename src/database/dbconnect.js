import mongoose from "mongoose"

export const atlasConnection = mongoose.createConnection(
  `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`
)

export const nocapConnection = mongoose.createConnection(
  `${process.env.MONGODB_URI1}/${process.env.MONGODB_NAME1}`
)

atlasConnection.on("connected", () => {
  console.log("Atlas DB Connected")
})

nocapConnection.on("connected", () => {
  console.log("NoCapCode DB Connected")
})