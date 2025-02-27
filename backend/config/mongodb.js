import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://sathiyapriya:Ss492017@atlas.telqn.mongodb.net/counsellingApp?retryWrites=true&w=majority&appName=Atlas") 
      
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

     export default connectDB