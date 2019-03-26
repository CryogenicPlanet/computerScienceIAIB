var request;
var ready = false
$(document).ready(async function() {
    var data = await getRequestDetails()
    //document.getElementById('updateYes').addEventListener('click', updateRequest(1));
    // document.getElementById('updateNo').addEventListener('click', updateRequest(-1));
    request = data.request
});
async function updateYes() {
    await updateRequest(1)
    console.log("Success")
}
async function updateNo() {
    await updateRequest(-1)
}
async function getRequestDetails() {
    var temp
    let searchParams = new URLSearchParams(window.location.search)
    let hash = searchParams.get('hash')

    await $.ajax({
        url: `https://compscience-ia-cryogenicplanet.c9users.io/getRequestDetails?hash=${hash}`,
        type: 'GET',
        headers: {
            "hash": hash
        },
        success: function(data) {
            ready = true
            console.log(data)
            temp = data

            document.getElementById("reason").textContent = data.request.Reason
            document.getElementById("studentName").textContent = data.student.Name
           let status = data.request.Status
            if (status != 0) {
                let state = ""
                if(status== 1){
                    state = "approved"
                } else {
                    state = "denied"
                }
                let message = data.student.Name +"'s Request has already been updated and has been " + state
                 M.toast({html : message,displayLength : 5000})
                document.getElementById("updateYes").disabled = true
                document.getElementById("updateNo").disabled = true
            }
        },
        dataType: 'json'
    });
    return temp
}

async function updateRequest(status) {
    if (ready) {
        console.log("Updating Request")
        let searchParams = new URLSearchParams(window.location.search)
        let hash = searchParams.get('hash')
        let data = {
            "Status": status,
            "uniqueHash": hash
        };
        data = JSON.stringify(data)
        console.log(status)
        await $.ajax({
            url: `https://compscience-ia-cryogenicplanet.c9users.io/updateRequest`,
            type: 'post',
            data: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //contentType: "application/json; charset=utf-8",
            //contentType: "application/json;charset=utf-8",
            success: function(data) {
                M.toast({ html: 'Request has been updated and student has been notified' })
                document.getElementById("updateYes").disabled = true
                document.getElementById("updateNo").disabled = true
            },
            error: function() {
                console.log('We are sorry but our servers are having an issue right now');
            }
        });
    }
}
