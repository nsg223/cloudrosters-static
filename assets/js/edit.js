$(document).ready(function() {

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        var warning = '<div class="alert alert-dismissible alert-danger"> <button type="button" class="close" data-dismiss="alert">&times;</button> This feature currently is not supported on mobile, note that there may be errors where saves do not take effect. Use this feature at your own risk. </div>';
        $(".title").append(warning); 
    }

    // This code allows the rows to be sortable when clicking on the icon.
    $(".move-row").mousedown(function() {
        $("tbody").sortable();
        $("tbody").sortable("option", "disabled", false);
    });
    $(".move-row").mouseup(function() {
        $("tbody").sortable( "option", "disabled", true );
        unsaved = true;
    });
    
    $('[data-toggle="tooltip"]').tooltip();
    
    $("#toggle-roles").click(function(e) {
        if ($(".role").attr("type") == 'text')
            $(".role").attr({type:"hidden"});
        else
            $(".role").attr({type:"text"});
    });
    
    $("#toggle-end").click(function(e) {
        if ($(".end").attr("type") == 'text')
            $(".end").attr({type:"hidden"});
        else
            $(".end").attr({type:"text"});
    });
    
    $("#share-button").click(function(e) {
        $("#share-modal").modal("show");
    });
    
    $("#clone-button").click(function(e) {
        $("#clone-modal").modal("show");
    });
    
    $(".clone").submit(function(e) {
    e.preventDefault();
       makeRosterObj(); 
       clone = rosterObj;
       clone.editkey = $("#edit-key-clone").val();
       clone.dates[0] = $("#date-clone").val();

        $.ajax({
            url: "/r/clone/" + rosterObj.id,
            type: "post",
            data: JSON.stringify(clone),
            processData: false,
            dataType: "json",
            contentType: "application/json"
        }).done(function(data) {
          unsaved = false;
          ga('send', 'event', 'Clone', 'Roster');
          window.location = '/e/' + data.id + '/' + data.editkey;
       });
    });

    $("table").on("click", ".remove-row", function (event) {
        if(confirm("Are you sure you want to delete this employee?")) {
            $(this).parent().parent().remove();
             unsaved = true;
        }
    });
    
    // Listen for clicks on table originating from .delete element(s)
    $("table").on("click", ".delete", function ( event ) {
        if (confirm("Are you sure you want to delete this date including all data?")) {
        // Get index of parent TD among its siblings (add one for nth-child)
        var ndx = $(this).parent().index() + 1;
        // Find all TD elements with the same index
        $("td", event.delegateTarget).remove(":nth-child(" + ndx + ")");
        $("th", event.delegateTarget).remove(":nth-child(" + ndx + ")");
         unsaved = true;
        }
    });
    
    $("#share-button").click(function() {
       $(".send-emails").removeClass("sr-only");
       $(".send-emails").html("Send Emails");
    });
    
    //Email Roster
    $(".email-form").submit(function(e) {
    e.preventDefault();
        if ($(".email-list").val() && document.getElementById("g-recaptcha-response").value) {
            $(".emails-sent-to").removeClass("text-warning");
            $(".send-emails").html("<span class='pe-7s-refresh-2 spin'></span> Sending Emails...");
            makeRosterObj();
            name = rosterObj.name;
            rid = rosterObj.id;
            emails = $(".email-list").val();

            emailInfo = {
                name: name,
                rid: rid,
                emails: emails,
                captcha: document.getElementById("g-recaptcha-response").value
            };

            sendEmails(emailInfo, function(sentList) {
                if (sentList.length > 0) {
                    $(".emails-sent-to").html(sentList);
                    $(".emails-sent-to").addClass("text-success");
                    ga('send', 'event', 'Share', 'Roster');
                } else {
                    $(".emails-sent-to").html("Invalid email addresses, please try again.");
                    $(".send-emails").removeClass("sr-only");
                }
            });
        } else {
            $(".emails-sent-to").html("Add emails addresses above to send an email and fill out the Captcha below.");
            $(".emails-sent-to").addClass("text-warning");
        }
    
    });
    
    //   $('body').on('keyup', 'input', function(e) {
    //      // Down Arrow
    //      if (e.which == 40 ) {
    //        $(this).closest('input').focus();
    //      }
    //      // Right Arrow
    //      if (e.which == 39 ) {
    //        $(this).closest('td').next('td').closest('input').focus();
    //      }
    //      // Left Arrow
    //      if (e.which == 38 ) {
    //        $(this).closest('td').prev('td').find('input').focus();
    //      }
    //    });
    
    //Code to delete roster
    $("#delete-roster").click(function() {
//        if(prompt("Do you want to completely delete this roster? You will be redirected to the homepage when this is complete.")) {
            //Send the Roster to the server.
            var saveStatus = unsaved;
            unsaved = false;
            var rosterID = $("#roster-id").val();
            //Change when password functionality exists
            var pass = prompt('Enter the edit key to delete the roster, You will be redirected to the homepage when this is complete.');
            
            var del = {rid: rosterID, editkey: pass};
            
            $.ajax({
                url: "/r/delete/" + rosterObj.id,
                type: "post",
                data: JSON.stringify(del),
                processData: false,
                dataType: "json",
                contentType: "application/json"
            }).done(function(data) {
                console.log(data);
                if (data.status == true) {
                    window.location = "/";
                    ga('send', 'event', 'Delete', 'Roster');
                } else {
                    console.log("Delete Failed.");
                    window.alert("Delete Failed, please try again later.");
                    unsaved = saveStatus;
                }
            });
       
    });
    
    //Add a column button
    $("#add-column").click(function() {
        var curday = $("th input:last").val();
        var nextday = new Date(curday.trim());
            nextday.setDate(nextday.getDate() + 1);
        var datestring = nextday.toDateString();
        
        var blanktd = '<td><input type="text"><span class="end"><input type="text"></span><span class="role"><input type="text"></span></td>';
        var blankth = '<th class="date-th"><input class="datepicker date" type="text" value="' + datestring + '"><span class="pe-7s-less delete" style="font-size:16px;"></span></th>'
        
        $("tr").each(function(index) {
            if (index != 0) {
                $(blanktd).insertAfter(this.lastElementChild);
            } else {
                $(blankth).insertAfter(this.lastElementChild);
            }
        });
        unsaved = true;
    });
        
    $("#remove-last-column").click(function() {
        if(confirm("Are you sure?")) {
        $("tr").each(function(index) {
                $(this.lastElementChild).remove();
        });
        }
    });
     
    // !add employee -- Code to add employee to table
    $("#add-row").click(function() {
        makeRosterObj();
        var thtml = '<tr><td><span class="pe-7s-expand1 move-row" style="font-size:16px;"></span><span class="pe-7s-trash remove-row" style="font-size:16px;"></span></td><td><input type="text" id="name" placeholder="Employee Name"></td>';
        
        for (var days = rosterObj.dates.length; days != 0; days--) {
            thtml += '<td><input type="text"><span class="end"><input type="text"></span><span class="role"><input type="text"></span></td>';
        }
            thtml += '</tr>';

        if ($("tbody tr:last")) {
            $(thtml).insertAfter("tbody tr:last");
        } else {
            console.log("No Employees...")
        }
        unsaved = true;
    });

    // Code for saving the roster changes
    $("#save-button").click(function() {
        $("#save-icon").removeClass("pe-7s-diskette");     
        $("#save-icon").addClass("pe-7s-refresh-2 spin");     
        makeRosterObj();
        $.ajax({
            url: "/r/save/" + rosterObj.id,
            type: "post",
            data: JSON.stringify(rosterObj),
            processData: false,
            dataType: "json",
            contentType: "application/json"
        }).done(function(data) {
            console.log(data);
            if (data.status) {
                unsaved = false;
                console.log("Saved Successfully.");
                $(".lastedit").html(new Date(data.lastedit).toLocaleString());
                $("#view-link").attr("href", $("#view-link").attr("href").substr(0,7) + '?t=' + Date.now());
                $("#save-button").addClass("save-success");
                $("#save-button").html('<i id="save-icon" class="pe-7s-check"></i> Saved');
                setTimeout(function() {
                    $("#save-button").removeClass("save-success");
                    $("#save-button").html('<i id="save-icon" class="pe-7s-diskette"></i> Save');
                  }, 3000);
            } else {
                $("#save-button").addClass("save-fail");
                $("#save-button").html('<i id="save-icon" class="pe-7s-attention"></i> Error... Try Again');
                setTimeout(function() {
                    $("#save-button").removeClass("save-fail");
                    $("#save-button").html('<i id="save-icon" class="pe-7s-diskette"></i> Save');
                  }, 3000);
            }   
        }).error(function(data) {
                $("#save-button").addClass("save-fail");
                $("#save-button").html('<i id="save-icon" class="pe-7s-attention"></i> Error... Try Again');
                setTimeout(function() {
                    $("#save-button").removeClass("save-fail");
                    $("#save-button").html('<i id="save-icon" class="pe-7s-diskette"></i> Save');
                  }, 3000);
        });
    });
    
    // This is the schema for the roster object. 
    rosterObj = {
                    "id": $("#roster-id").val(),
                    "dates": [],
                    "name": $("#roster-name").val(),
                    "rows": []
                };
    
    // Create the javascript object here (the magic)
    function makeRosterObj() {
        
        var rows = "";
        //Loop through each input field
        $("td input").each(function(index) {
            //Check if a new row / person and add a seperator used to split later
            if (this.id == "name") {
                rows += "%%%";
            }
            //Check if the field is empty and add a space
            if (this.value == "" && this.id != "name") {
                rows += " ";
            }
            //Add a - after every input - used to split later
            rows += "~~~" + this.value;
        });
        
        //Split each row
        x = rows.split("%%%~~~");
        //console.log(x);
        //Fix empty row error
        x.splice(0, 1);
        
        rosterRows = [];

        //Loop through each input.
        for (j = 0; j < x.length; j++) {
            temp = x[j].split("~~~");
            
            //Set the schema for the roster object and assign the name
            rowSchema = {
                    "name": temp[0].trim(),
                    "shifts": []
                };
            
            for (var s; s < temp.length; s++) {
                if (temp[s] == " ") {
                    temp[s] = "";
                }
            }
            
            //Loop through all of the shifts data
            for (var i = 1; i < temp.length-1; i+=3) {
                var tempobj = {
                        "start": temp[i].trim(),
                        "end": temp[i+1].trim(),
                        "role": temp[i+2].trim()
                };
                rowSchema.shifts.push(tempobj);
            }
            rosterRows.push(rowSchema);
        }
        
        rosterObj.rows = rosterRows;
        rosterObj.name = $("#roster-name").val();
        rosterObj.dates = getDates();
        rosterObj.notes = $(".notes").val();
        rosterObj.editkey = window.location.pathname.split("/")[3];
    }
    
    function getDates() {
        var dates = [];
       $("th input").each(function(index) {
           dates.push(this.value);
        });
        return(dates);
    }

    function sendEmails(emailObject, callback) {
        emailObject.editkey = rosterObj.editkey;
        $.ajax({
            url: "/r/share/" + rosterObj.id,
            type: "post",
            data: JSON.stringify(emailObject),
            processData: false,
            dataType: "json",
            contentType: "application/json"
        }).done(function(data) {
            if (data) {
                var emailList = data;
                var readable = "Emails sent to: ";
                for (var el = 0; el < emailList.length; el++) {
                    readable += emailList[el];
                    if (el != emailList.length - 1) {
                          readable += ", ";
                    }
                }
                $(".send-emails").addClass("sr-only");
                $(".emails-sent-to").text(readable);
                console.log(readable);
                if (emailList.length == 0) {
                    $(".emails-sent-to").text("Invalid email addresses, please try again.");
                }
                callback(data);
            } else {
                $(".emails-sent-to").text("Captcha verification failed, refresh the page and try again.");
                $(".send-emails").addClass("sr-only");
            }
        }).error(function(data) {
                $(".emails-sent-to").text("Error occured, please refresh the page and try again.");
                $(".send-emails").addClass("sr-only");
        });
    }
    
    var lastEdit = $("#lastedit-value").val();
    var LastEditDate = new Date(lastEdit).toLocaleString();
    
    $(".lastedit").html(LastEditDate);
    
    // Checks to see if there have been any changes made before leaving the page without saving.
    var unsaved = false;
    $(":input").change(function(){ //trigers change in all input fields including text type
        unsaved = true;
    });

    function unloadPage(){ 
        if(unsaved){
            return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
        }
    }
    window.onbeforeunload = unloadPage;
   
        // Datepicker
    $(function() {
            $('.datepicker').datepicker({
				inline: true,
				showOtherMonths: true,
                dateFormat: "D M d yy"
			})
    });
    
    document.addEventListener("keydown", function(e) {
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        $("#save-button").click();
      }
    }, false);
    
    if (!getCookie("visited")) {
        setCookie("visited", true, 30);
        $('#tutorial-modal').modal('show');
    }
    
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
});


