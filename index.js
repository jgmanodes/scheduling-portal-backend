import Express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import reservationRoutes from "./routes/reservationRoutes.js"

const app = Express();
app.use(Express.json());

dotenv.config();

connectDB();

const allowedDomains = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if(allowedDomains.indexOf(origin) !== -1) {
            // El origen del request esta permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido con CORS'))
        }
    },
};

app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});