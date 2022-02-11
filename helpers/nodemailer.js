const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "alizeb831@gmail.com",
    pass: "ali@0000",
  },
});

var mailOptions = {
  from: "alizeb831@gmail.com",
  to: "farzan98great57@gmail.com",
  subject: "testing",
  text: "testing",
};

transport.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log("Email sent successfully.");
  }
});
