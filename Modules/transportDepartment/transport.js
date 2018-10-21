var exports = module.exports = {};

exports.getStudentsLeft = async function(req,res,con){
    var students = [];
    let getStudents = await con.query(`SELECT * FROM Students WHERE USID IN(SELECT Student FROM Requests WHERE Time>= CURDATE() AND Status = 1)`);
    function addStudent(name,grade,busNumber,oakID){
        this.name = name,
        this.grade = grade,
        this.busNumber = busNumber
        this.OAKID = oakID
    }
    for(var student of getStudents){
        students.push(new addStudent(student.Name,student.Class,student.busNumber,student.OAKID))
    }
    res.status(200).json({
                students: students
            });
}