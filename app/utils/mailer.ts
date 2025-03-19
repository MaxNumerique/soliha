import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true", // true pour SSL, false pour TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  console.log("📩 Email envoyé à :", email);
  console.log("🔗 Lien généré pour la réinitialisation :", resetLink);


  if (!token) {
    console.error("❌ ERREUR : le token n'a pas été généré !");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Initialisation de votre mot de passe",
    html: `
      <p>Bonjour,</p>
      <p>Veuillez cliquer sur le lien ci-dessous pour définir votre mot de passe :</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Ce lien expire dans 24 heures.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✉️ Email envoyé à:", email);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error);
  }
}
