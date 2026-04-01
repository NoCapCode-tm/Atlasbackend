import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  smiles:{
    type:String
  }
});

export const Counter = mongoose.model("Counter", CounterSchema);
