import express from "express"
const router = express.Router();
import {
    addReservation,
    getReservations,
    getReservation,
    updateReservation,
    deleteReservation,
} from '../controllers/reservationController.js'
import checkAuth from "../middleware/authMiddleware.js";

router.post('/add', checkAuth, addReservation)
router.get('/all', checkAuth, getReservations)
router.route('/:id')
    .get(checkAuth, getReservation)
    .put(checkAuth, updateReservation)
    .delete(checkAuth, deleteReservation)

export default router;