import Reservation from '../models/Reservation.js';

// Crear una reserva.
const addReservation = async (req, res) => {
    const reservation = new Reservation(req.body);
    reservation.user_id = service.user_id;
    try {
        const storedReservation = await reservation.save()
        res.json({ storedReservation })
    } catch (error) {
        console.log(error)
    }
}

// Obtener las reservas que sean del usuario autenticado.
const getReservations = async (req, res) => {
    const reservations = await Reservation.find().where("user_id").equals(req.user);
    if (reservations.length === 0) {
        return res.status(400).json({ msg: "No existen reservas." })
    }
    res.json(reservations)
}

// Obtener una reserva.
const getReservation = async (req, res) => {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) {
        return res.status(400).json({ msg: "Reserva no encontrada" })
    }
    if (req.user._id.toString() !== reservation.user_id.toString()) {
        return res.status(403).json({ msg: "Acción no válida" })
    }
    res.json(reservation)
}

// Editar una reserva.
const updateReservation = async (req, res) => {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) {
        res.status(404).json({ msg: "Reserva no encontrada" })
    }
    if (req.user._id.toString() !== reservation.user_id.toString()) {
        return res.status(403).json({ msg: "Acción no válida" })
    }
    reservation.name = req.body.name || reservation.name;
    reservation.mail = req.body.mail || reservation.mail;
    reservation.phone = req.body.phone || reservation.phone;
    reservation.date = req.body.date || reservation.date;
    reservation.message = req.body.message || reservation.message;
    try {
        const storedReservation = await reservation.save();
        res.json({ storedReservation, msg: "Reserva modificada con éxito." })
    } catch (error) {
        console.log(error)
    }
}

// Eliminar una reserva.
const deleteReservation = async (req, res) => {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) {
        return res.status(404).json({ msg: "Reserva no encontrada" })
    }
    if (req.user._id.toString() !== reservation.user_id.toString()) {
        return res.status(403).json({ msg: "Acción no válida" })
    }
    try {
        await reservation.deleteOne();
        res.json({ msg: "Reserva eliminada con éxito." })
    } catch (error) {
        console.log(error)
    }
}


export {
    addReservation,
    getReservations,
    getReservation,
    updateReservation,
    deleteReservation
}