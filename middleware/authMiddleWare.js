import jwt from "jsonwebtoken";
import User from "../models/User.js";

const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraemos el token y lo decodificamos con jwt.
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Retornamos el objeto completo menos lo seleccionado (-password -token)
            req.user = await User.findById(decoded.id).select( "-password -token" );
            return next();

        } catch (error) {
            const e = new Error('Token no válido.')
            return res.status(403).json({ msg: e.message })
        }
    }
    if (!token) {
        const error = new Error('Token no válido.')
        return res.status(403).json({ msg: error.message })
    }
    next();
}

export default checkAuth;