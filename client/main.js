 // Or with jQuery
 let ready = false
 $(document).ready(async function() {
  document.getElementById("submitRequest").addEventListener("click", sendRequest())
  $('input.autocomplete').autocomplete({
   data: await getStudentsId(),
   onAutocomplete: async function() {

    var oakId = document.getElementById('autocomplete-input').value
    if (oakId == "Not Found") {
     document.getElementById('name').disabled = false
     document.getElementById('busNumber').disabled = false
     document.getElementById('email').disabled = false
     document.getElementById('class').disabled = false
     document.getElementById('section').disabled = false
     //document.getElementById('usid').disabled = false
     document.getElementById('schoolId').style.display = 'block'
    }
    else {
     document.getElementById('schoolId').style.display = 'none'
     var data = await getStudentDetails(oakId)
     document.getElementById('name').value = data.Name
     document.getElementById('busNumber').value = data.BusNumber
     document.getElementById('email').value = data.Email
     document.getElementById('class').value = data.Class
     document.getElementById('section').value = data.Section
     document.getElementById('usid').value = data.USID
    }
    document.getElementById('studentDetails').style.display = 'block'
    document.getElementById('submitRequest').disabled = false
   }
  });

 });
 async function getStudentsId() {
  console.log("Called Get Students")
  hideDetails();
  var studentIds = {
   "Not Found": null
  }
  await $.ajax({
   url: "https://compscience-ia-cryogenicplanet.c9users.io/getStudentsId",
   type: 'GET',
   success: function(data) {
    ready = true
    for (var studentId of data.studentId) {
     console.log(studentId)
     studentIds[`${studentId}`] = null
    }

   },
   dataType: 'json'
  });
  console.log(studentIds)
  return studentIds
 }
 async function sendRequest() {
  let callRequest = false;
  if (ready) {
   console.log("Called")
   var temp
   var reason = document.getElementById('reason').value;
   var request = {
    "reason": reason
   }
   if (reason) {
    var usid = document.getElementById('usid').value
    if (usid) {
     request.usid = usid
     callRequest = true
    }
    else {
     if (document.getElementById('name').value == "" || document.getElementById('email').value == "" || document.getElementById('class').value == "" || document.getElementById('oakId').value == "" || document.getElementById('busNumber').value == "" || document.getElementById('section').value == "") {
      console
      M.toast({ html: 'Please fill out all the fields as they are required for you to make a request' })
     }
     else {
      callRequest = true
     }
     request.name = document.getElementById('name').value
     request.email = document.getElementById('email').value
     request.class = document.getElementById('class').value
     request.OakId = document.getElementById('oakId').value
     request.busNumber = document.getElementById('busNumber').value
     request.section = document.getElementById('section').value

    }
    if (callRequest) {
     console.log(request);
     request = JSON.stringify(request)
     /* await $.ajax({
          url: `https://compscience-ia-cryogenicplanet.c9users.io/addRequest`,
          type: 'post',
          data: request,
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          //contentType: "application/json; charset=utf-8",
          //contentType: "application/json;charset=utf-8",
          success: function(data) {
              console.log('Success');
              console.log(data);
          },
          error: function() {
              console.log('We are sorry but our servers are having an issue right now');
          }
      }); */
     var xhr = new XMLHttpRequest();
     xhr.open('POST', 'https://compscience-ia-cryogenicplanet.c9users.io/addRequest', true);
     xhr.setRequestHeader('Content-type', 'application/json');
     xhr.onload = function(data) {
      // do something to response
      console.log('Success');
      console.log(data);
      M.toast({ html: 'Your Request has been added and the concerned teacher has been emailed.' })

     };
     xhr.send(request);
     M.toast({ html: 'Your Request has been added and the concerned teacher has been emailed.' })
     document.getElementById('studentDetails').style.display = 'none'
     document.getElementById('submitRequest').disabled = true
    }
   }
   else {
    M.toast({ html: 'Please fill out an reason!' })

   }
  }
 }

 function hideDetails() {
  document.getElementById('studentDetails').style.display = 'none'
  document.getElementById('schoolId').style.display = 'none'
 }
 async function getStudentDetails(id) {
  console.log(id)
  var temp
  await $.ajax({
   url: `https://compscience-ia-cryogenicplanet.c9users.io/getStudentDetails?id=${id}`,
   type: 'GET',
   headers: {
    "id": id
   },
   success: function(data) {
    console.log(data)
    temp = data
   },
   dataType: 'json'
  });
  return temp.student
 }
 