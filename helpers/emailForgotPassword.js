import nodemailer from 'nodemailer';

const emailForgotPassword = async (data) => {
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
        from: "SP - Scheduling Portal.",
        to: mail,
        subject: 'Restablece tu password en SP',
        text: 'Restablece tu password en SP',
        html: `<p>Hola: ${name}, has solicitado restablecer tu password.</p>

            <p>Sigue el siguiente enlace para generar un nuevo password:
            <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Restablecer password</a></p>

            <p>Si tu no solicitaste restablecer el password, puedes ignorar este mensaje.</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);

}

export default emailForgotPassword;
