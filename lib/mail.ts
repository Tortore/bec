import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site";

type ContactMail = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

function mailConfigured() {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();
  return Boolean(user && pass && pass !== "votre-mot-de-passe");
}

function createMailTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendContactMail(fields: ContactMail) {
  if (!mailConfigured()) return;

  const transporter = createMailTransporter();
  const to = process.env.EMAIL_USER;

  await transporter.sendMail({
    from: `"${siteConfig.shortName}" <${to}>`,
    to,
    replyTo: fields.email,
    subject: `[BEC] ${fields.subject} — ${fields.name}`,
    text: [
      `Nom : ${fields.name}`,
      `E-mail : ${fields.email}`,
      fields.phone ? `Téléphone : ${fields.phone}` : null,
      `Sujet : ${fields.subject}`,
      "",
      fields.message,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

type ApplicationMail = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  position: string;
  experience: string;
  education: string;
  message: string;
  cvFileName: string;
  cvBuffer: Buffer;
  cvMimeType: string;
  idFileName?: string;
  idBuffer?: Buffer;
  idMimeType?: string;
};

export async function sendApplicationMail(fields: ApplicationMail) {
  if (!mailConfigured()) return;

  const transporter = createMailTransporter();
  const to = process.env.EMAIL_USER;
  const fullName = `${fields.firstName} ${fields.lastName}`;

  await transporter.sendMail({
    from: `"${siteConfig.shortName}" <${to}>`,
    to,
    replyTo: fields.email,
    subject: `[BEC] Candidature ${fields.position} — ${fullName}`,
    text: [
      `Candidature reçue via le site BEC.`,
      "",
      `Nom : ${fullName}`,
      `E-mail : ${fields.email}`,
      `Téléphone : ${fields.phone}`,
      `Ville : ${fields.city}`,
      `Profil : ${fields.position}`,
      `Expérience : ${fields.experience}`,
      `Formation : ${fields.education}`,
      `CV : ${fields.cvFileName}`,
      fields.idFileName ? `Pièce d’identité : ${fields.idFileName}` : null,
      "",
      "Lettre de motivation :",
      fields.message,
    ]
      .filter(Boolean)
      .join("\n"),
    attachments: [
      {
        filename: fields.cvFileName,
        content: fields.cvBuffer,
        contentType: fields.cvMimeType,
      },
      ...(fields.idFileName && fields.idBuffer
        ? [
            {
              filename: fields.idFileName,
              content: fields.idBuffer,
              contentType: fields.idMimeType,
            },
          ]
        : []),
    ],
  });
}
