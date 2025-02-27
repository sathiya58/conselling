import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Ensure correct collection reference
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true }, // Ensure correct collection reference
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now }, // Changed to Date type with default value
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
});

// Ensure model is properly registered
const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
