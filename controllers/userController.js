import User from "../models/User.js";
import generateJWT from "../helpers/generateJWT.js";
import generateId from "../helpers/generateId.js";
import emailRegister from "../helpers/emailRegister.js";
import emailForgotPassword from "../helpers/emailForgotPassword.js";

// Crear nuevo usuario.
const signOn = async (req, res) => {
    const { mail, name } = req.body;

    // Verificar si el usuario ya existe en la base de datos.
    const userExist = await User.findOne({ mail });
    if (userExist) {
        const error = new Error('El correo ya se encuentra registrado.')
        return res.status(400).json({ msg: error.message })
    }

    try {
        // Crear nuevo usuario.
        const user = new User(req.body);
        const userSaved = await user.save();

        // Enviar email.
        emailRegister({ mail, name, token: userSaved.token,});

        res.json({ userSaved, msg: "Se ha enviado un correo con un link para verificar su cuenta."})
    } catch (error) {
        console.error(error);
    }
};

// Mostrar perfil
const profile = (req, res) => {
    const { user } = req;
    res.json(user);
};

// Confirmar cuenta de usuario.
const confirm = async (req, res) => {
    const { token } = req.params
    const userConfirm = await User.findOne({ token })

    if (!userConfirm) {
        const error = new Error('Token inválido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        userConfirm.token = null;
        userConfirm.verifiedAccount = true;
        await userConfirm.save();
        res.json({ msg: "Usuario confirmado con éxito." })
    } catch (error) {
        console.log(error);
    }
}

// Autenticar usuario cuando inicia sesión.
const authenticate = async (req, res) => {
    const { mail, password } = req.body;

    // Comprobar si existe el usuario.
    const user = await User.findOne({ mail });
    if (!user) {
        const error = new Error("Usuario no existe");
        return res.status(404).json({ msg: error.message })
    }

    // Comprobar si la cuenta esta verificada.
    if (!user.verifiedAccount) {
        const error = new Error("Cuenta no verificada, verifica tu correo electrónico.")
        return res.status(403).json({ msg: error.message })
    }

    // Comprobar el password
    if (await user.checkPassword(password)) {
        // Autenticar
        res.json({
            _id: user._id,
            name: user.name,
            mail: user.mail,
            token: generateJWT(user.id)
        });
    } else {
        const error = new Error("Password incorrecto")
        return res.status(403).json({ msg: error.message })
    }
}


// ¿Olvidaste tu contraseña?
const forgotPassword = async (req, res) => {
    const { mail } = req.body;

    const mailExist = await User.findOne({ mail })
    if (!mailExist) {
        const error = new Error('Usuario no existe')
        return res.status(400).json({ msg: error.message })
    }

    try {
        mailExist.token = generateId()
        await mailExist.save();

        // Enviar mail con instrucciones.
        emailForgotPassword({ mail, name: mailExist.name, token: mailExist.token });
        res.json({ msg: "Se ha enviado un correo con instrucciones para cambiar tu contraseña" })
    } catch (error) {
        console.log(error)
    }
}

// Verificar si el token es el correcto.
const checkToken = async (req, res) => {
    const { token } = req.params;
    const validToken = await User.findOne({ token })

    if (validToken) {
        res.json({ msg: "Token válido." })
    } else {
        const error = new Error('Token no válido.');
        return res.status(404).json({ msg: error.message })
    }
}

// Guardar nueva contraseña en base de datos.
const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ token })
    if (!user) {
        const error = new Error('Ha ocurrido un error.')
        return res.status(400).json({ msg: error.message })
    }

    try {
        user.token = null;
        user.password = password;
        await user.save();
        res.json({ msg: "Password modificado con éxito." })
    } catch (error) {
        console.log(error)
    }
}


export {
    signOn,
    profile,
    confirm,
    authenticate,
    forgotPassword,
    checkToken,
    newPassword
};