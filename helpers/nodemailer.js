const nodemailer = require("nodemailer");

exports.sendMail = (email, name, confirmationCode) => {
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
    to: `${email}`,
    subject: "Email Verification",
    html: `<p> Hello ${name}, <br>

    You registered an account on NOOR NFT , before being able to use your account you need to verify that this is your email address by clicking here:</p>

    <a href = http://localhost:5000/confirm/${confirmationCode}>Click Here</a> <br>

    Kind Regards, NOOR NFT`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Email sent successfully.");
    }
  });
};
