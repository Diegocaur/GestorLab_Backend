import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // información del email
  const info = await transport.sendMail({
    from: '"GestorLab" <cuentas@GestorLab.com>',
    to: email,
    subject: "GestorLab-Confirma Tu Cuenta",
    text: "Confirma tu cuenta en gestorlab",
    html: `<p>Hola: ${nombre} Confirma tu cuenta en GestorLab</p>
    <p>Para confirmar tu cuentra presiona el siguiente enlace: 
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>
    </p>

    <p>Si no creaste esta cuenta , ignora el mensaje</p>
    
    `,
  });
};
//olvide password

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // información del email
  const info = await transport.sendMail({
    from: '"GestorLab" <cuentas@GestorLab.com>',
    to: email,
    subject: "GestorLab-Reestablecer Contraseña",
    text: "Reestablecer Contraseña",
    html: `<p>Hola: ${nombre} Reestablece Tu Contraseña</p>
    <p>Para reestablecer tu contraseña presiona el siguiente enlace: 
    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Contraseña</a>
    </p>

    <p>Si no solicitaste reestablecer tu contraseña , ignora el mensaje</p>
    
    `,
  });
};
