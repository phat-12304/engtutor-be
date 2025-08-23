const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "noreply.filmgo@gmail.com",
    pass: "tspojqiaizxoirln",
  },
});

/**
 * Hàm gửi email
 * @param {string} to - Địa chỉ email người nhận
 * @param {string} subject - Chủ đề email
 * @param {string} text - Nội dung email (dạng văn bản thuần)
 * @param {string} html - Nội dung email (dạng HTML)
 */
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: "noreply.filmgo@gmail.com", // Địa chỉ người gửi
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email." };
  }
};

module.exports = sendEmail;
