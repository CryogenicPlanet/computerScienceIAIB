const sha512 = require('sha512');
const nodemailer = require('nodemailer');
var randomstring = require("randomstring");
var uniqueHash;
var exports = module.exports = {};
exports.getDetails = async function(req, res, con) {
    console.log(req.query.id)
    var oakId = req.query.id || req.headers['id']
    let [student] = await con.query(`SELECT * FROM Students WHERE OAKID="${oakId}"`)
    // let teachers = await getTeachers(con,student.Class)
    //let coordinators = await getCoordinators(con,student.Class)
    res.status(200).json({
        "student": student
    });
}
exports.addRequest = async function(req, res, con) {
    console.log("Body :")
    console.log(req.body)
    var usid = req.body.usid;
    // var teacher = req.body.utid;
    var givenReason = req.body.reason;  
    //    var coordinator = req.body.ucid;
    var random = randomstring.generate(11)
    uniqueHash = sha512(random)
    uniqueHash = uniqueHash.toString('hex');
    // let [getTeacherEmail] = await con.query(`SELECT Email FROM Teacher WHERE UTID=${teacher}`)
    //    var teacherEmail = getTeacherEmail.Email;
    //  let [getCoordinatorEmail] = await con.query(`SELECT Email FROM Coordinators WHERE UCID=${coordinator}`)
    //var coordinatorEmail = getCoordinatorEmail.Email;
    if (usid) {
        let [student] = await con.query(`SELECT * FROM Students WHERE USID=${usid}`)
        let teacher = await getTeachers(con, student.Class,student.Section)
        let coordinator = await getCoordinators(con, student.Class)
        //console.log(teacher)
        //console.log(coordinator)
        addRequestDb(con, usid, coordinator.UCID, teacher.UTID,givenReason)
        sendRequestEmail(teacher.Email, coordinator.Email, student.Email, givenReason, student.Name)

    }
    else {
        var Name = req.body.name;
        var email = req.body.email;
        var Class = req.body.class;
        var OakId = req.body.OakId;
        var BusNumber = req.body.busNumber;
        var Section = req.body.section;
        let addStudent = await con.query(`INSERT INTO Students (Name,Class,OAKID,BusNumber,Email,Section) VALUES ("${Name}",${Class},"${OakId}",${BusNumber},"${email}","${Section}")`)
        let [studentId] = await con.query(`SELECT USID FROM Students WHERE OAKID="${OakId}"`)
        var uniqueID = studentId.USID;
        let teacher = getTeachers(con, Class,Section)
        let coordinator = getCoordinators(con, Class)
        addRequestDb(con, uniqueID, coordinator.UCID, teacher.UTID,givenReason)
        sendRequestEmail(teacher.Email, coordinator.Email, email, givenReason, Name)
        res.status(200).json({
            message : "success"
        })
    }
}
let getTeachers = async function(con, grade,section) {
    let [teachers] = await con.query(`SELECT * FROM Teacher WHERE Class=${grade} AND Section="${section}"`)
    return teachers
}
let getCoordinators = async function(con, grade) {
    let [coordinators] = await con.query(`SELECT * FROM Coordinators WHERE lowerBoundClass <= ${grade} AND upperBoundClass >= ${grade} `)
    return coordinators
}
let addRequestDb = async function(con, usid, ucid, utid,reason) {
    let request = await con.query(`INSERT INTO Requests (Student,Coordinator,Teacher,UniqueHash,Reason) VALUES (${usid},${ucid},${utid},"${uniqueHash}","${reason}")`)
}
let sendRequestEmail = function(teacherEmail, coordinatorEmail, studentEmail, reason, studentName) {
    var message = `<h5>Dear Sir/Ma'am</h5>
    <p>Your Student, ${studentName} has requested your permission to leave school early. Giving the following reason : ${reason} </p>
    <p> Please follow click <a href="https://compscience-ia-cryogenicplanet.c9users.io:8081/client/update.html?hash=${uniqueHash}"> here!</a> to accept or deny their request </p>
    
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
            to: [teacherEmail, coordinatorEmail],
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
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}
