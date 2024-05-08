import mongoose from 'mongoose';

const reservationSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true,
        default: null
    },
    mail: {
        type: String,
        trim: true,
        default: null
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    message: {
        type: String,
        default: null
    },

}, {
    timestamps: true
})

const Reservation = mongoose.model("Reservation", reservationSchema)

export default Reservation;