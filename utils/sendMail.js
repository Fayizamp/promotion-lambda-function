import dotenv from "dotenv";
dotenv.config(); 

import nodemailer from "nodemailer";

const { NODE_EMAIL_ID, NODE_PASS } = process.env;

const sendMail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: NODE_EMAIL_ID,
        pass: NODE_PASS,
      },
    });

    const mailOptions = {
      from: NODE_EMAIL_ID,
      to: data.to,
      subject: data.subject,
      text: data.text,
      attachments: data.attachments || [],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("🚀 ~ sendMail ~ error:", error);
      } else {
        console.log("🚀 ~ Email sent: ~ response: " + info.response);
      }
    });
  } catch (error) {
    console.log("🚀 ~ sendMail ~ error:", error);
  }
};

export default sendMail;
