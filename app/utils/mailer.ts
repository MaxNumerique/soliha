// utils/mailer.ts
import nodemailer from 'nodemailer';

// Configuration du transporteur d'email avec Mailtrap
const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER, // Votre utilisateur Mailtrap
    pass: process.env.MAILTRAP_PASS, // Votre mot de passe Mailtrap
  },
});

export const sendResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: 'no-reply@solihapbbinconstruction.rf.gd',
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de réinitialisation envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
  }
};
