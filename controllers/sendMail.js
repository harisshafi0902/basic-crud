const nodemailer = require("nodemailer");

const sendMail = async (email) => {
  let tranpsorter = nodemailer.createTransport({
    // connect with the smtp

    host: "smtp.ethereal.email",
    port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: "vilma23@ethereal.email",
      pass: "JQWxMZJ2GG5f7MGUKu",
    },
  });

  const info = await tranpsorter.sendMail({
    from: "haris@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Hello haris✔", // Subject line
    text: "Hello haris, you've got an imaginary email", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  console.log("Message sent: %s", info.messageId);

  res.json(info);
};

module.exports = sendMail;
