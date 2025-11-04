import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    movieId: {
        type: String,
        required: true
    }
})

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
