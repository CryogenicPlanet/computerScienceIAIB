const nodemailer = require('nodemailer');
var exports = module.exports = {};

exports.updateRequest = async function(req, res, con) {
    var hash = req.body.uniqueHash;
    var status = req.body.Status;
    var message;
    let [getRequest] = await con.query(`SELECT * FROM Requests WHERE UniqueHash="${hash}"`)
    let [getStudent] = await con.query(`SELECT * FROM Students WHERE USID=${getRequest.Student}`)
    var email = getStudent.Email;
    if (getRequest.Status == 0) { // Un Updated Stauts
        let updateStatus = await con.query(`UPDATE Requests SET Status=${status} WHERE UniqueHash="${hash}"`)
        if (status == -1) {
            message = `<h5>Dear Student</h5>
    <p>Your request to leave early has <b>not</b> been granted by your teacher/Coordinator.</p>
    `
        }
        else {
            message = `<h5>Dear Student</h5>
    <p>Your request to leave early has been granted by your teacher/Coordinator.</p>
    `
        }
       await sendUpdateMail(email, message)
        res.status(200).json({
            message: "Email alert sent"
        });
    }
}
exports.getRequestDetails = async function(req, res, con) {
    var hash = req.query.hash || req.headers['hash']
    let [request] = await con.query(`SELECT * FROM Requests WHERE UniqueHash="${hash}"`)
    let [student] = await con.query(`SELECT * FROM Students WHERE USID = ${request.Student}`)
    res.status(200).json({
        "request": request,
        "student": student
    });
}
let sendUpdateMail = function(studentEmail, message) {
    console.log("Sending update email")
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: "ssl", // true for 465, false for other ports
            auth: {
                user: 'no.reply.dev.smtp@gmail.com', // generated ethereal user
                pass: 'nooberest' // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '""<no.reply.dev.smtp@gmail.com>', // sender address
            to: studentEmail,
            bcc: 'rahultarak12345@gmail.com', // Us!
            subject: "Update on your Request", // Subject line
            html: message // Fancy Shit here
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log("Email alert sent");

            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}
