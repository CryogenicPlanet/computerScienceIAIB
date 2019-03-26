var dateFormat = require('dateformat');

var exports = module.exports = {};

exports.getApprovedStudents = async function(req, res, con) {
    //console.log("Hello")
    var students = [];
    let getStudents = await con.query(`SELECT * FROM Students WHERE USID IN(SELECT Student FROM Requests WHERE Time>= CURDATE() AND Status = 1)`);

    function addStudent(name, grade, busNumber, oakID) {
        this.name = name,
            this.class = grade,
            this.busNumber = busNumber,
            this.OAKID = oakID
    }
    for (var student of getStudents) {
        console.log(student.busNumber)
        students.push(new addStudent(student.Name, student.Class, student.BusNumber, student.OAKID))
    }
    console.log(students)
    /*res.status(200).json({
                students: students
            });*/
    
    res.render('../client/transport.ejs', {
        students: students,
        date : dateFormat(new Date(), "dd-MM-yyyy")
    })
}
