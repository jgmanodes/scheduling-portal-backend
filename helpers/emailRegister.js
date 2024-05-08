import nodemailer from 'nodemailer';

const emailRegister = async (data) => {
    // Crear el transporter. Ver documentación nodemailer.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }); 

    const { mail, name, token } = data;

    // Enviar mail
    const info = await transporter.sendMail({
        from: "SP -  Scheduling Portal",
        to: mail,
        subject: 'Comprueba tu cuenta en SP',
        text: 'Comprueba tu cuenta en SP',
        html: `<p>Hola: ${name}, comprueba tu cuenta en SP.</p>
            <p>Tu cuenta ya está lista, solo debes comprobarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Comprobar Cuenta</a></p>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);

}

export default emailRegister;
