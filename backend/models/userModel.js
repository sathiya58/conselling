import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    
    // ✅ Change address from String to an Object
    address: {
        line1: { type: String, default: "" },
        line2: { type: String, default: "" },
    },
    
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Not Selected"], default: "Not Selected" },
    image: { type: String },
}, { timestamps: true }); // ✅ Automatically add createdAt & updatedAt

const userModel = mongoose.model("users", userSchema);

export default userModel;
