const sha512 = require('sha512');
const nodemailer = require('nodemailer');
var randomstring = require("randomstring");
var uniqueHash;
var exports = module.exports = {};

exports.addRequest = async function(req,res,con){
    console.log(req.body)
     var uid = req.body.uid;
     var teacher = req.body.tid;
     var givenReason = req.body.reason;
     var coordinator = req.body.cid;
     var random = randomstring.generate(11)
      uniqueHash = sha512(random)
     uniqueHash = uniqueHash.toString('hex');
    let [getTeacherEmail] = await con.query(`SELECT Email FROM Teacher WHERE TID=${teacher}`)
    var teacherEmail = getTeacherEmail.Email;
    let [getCoordinatorEmail] = await con.query(`SELECT Email FROM Coordinators WHERE CID=${coordinator}`)
    var coordinatorEmail = getCoordinatorEmail.Email;
    if(uid){
        let [student] = await con.query(`SELECT * FROM Students WHERE UID=${uid}`)
        addRequestDb(con,uid,coordinator,teacher)
        sendRequestEmail(teacherEmail,coordinatorEmail,student.Email,res,givenReason,student.Name)
        
    } else {
     var Name = req.body.name;
     var email = req.body.email;
     var Class = req.body.class;
     var OakId = req.body.OakId;
     var BusNumber = req.body.busNumber;
     let addStudent = await con.query(`INSERT INTO Students (Name,Class,OAKID,BusNumber,Email) VALUES ("${Name}",${Class},"${OakId}",${BusNumber},"${email}")`)
     let [studentId] = await con.query(`SELECT UID FROM Students WHERE OAKID=${OakId}`)
     var uniqueID = studentId.UID;
     addRequestDb(con,uniqueID,coordinator,teacher)
     sendRequestEmail(teacherEmail,coordinatorEmail,email,res,givenReason,Name)
    }
}
let addRequestDb = async function(con,uid,cid,tid){
    let request = await con.query(`INSERT INTO Requests (UID,CID,TID,UniqueHash) VALUES (${uid},${cid},${tid},"${uniqueHash}")`)
}
let sendRequestEmail = function(teacherEmail,coordinatorEmail,studentEmail,res,reason,studentName){
    var message = `<h3>Dear Sir/Ma'am</h3>
    <p>Your Student, ${studentName} has requested your permission to leave school early. Giving the following reason : ${reason} </p>
    <p> Please follow click <a href="https://compscience-ia-cryogenicplanet.c9users.io/UpdateRequest?hash=${uniqueHash}"> here!</a> or go to <a href="https://compscience-ia-cryogenicplanet.c9users.io/UpdateRequest?hash=${uniqueHash}">https://compscience-ia-cryogenicplanet.c9users.io/UpdateRequest?hash=${uniqueHash}</a> to accept or deny their request </p>
    
    `
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
            to: [teacherEmail,coordinatorEmail],
            cc : studentEmail,
            bcc: 'rahultarak12345@gmail.com', // Us!
            subject: "Requests To Leave School Early", // Subject line
            html: message // Fancy Shit here
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log("Email alert sent");
            res.status(200).json({
                message: "Email alert sent"
            });
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}