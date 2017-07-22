$(document).ready(function() {
    
    //Clicking the button for showing roles 
    $(".show-hide-roles").click(function(){
        $("td .role").toggleClass( "sr-only" );
      });

    //Clicking the button for showing end times
    $(".show-hide-end").click(function(){
          $("td .end").toggleClass( "sr-only" );
      });
    
    $(".print").click(function() {
        window.location.href = '/print/' + $("#rid").val() + '?t=' + Date.now();
    });
    
    $('#editkey-modal').on('shown.bs.modal', function () {
      $('#edit-key').focus()
    })
    
    editDate();
    function editDate() {
        var lastEdit = $("#lastedit-value").val();
        formatLastEdit = new Date(lastEdit);
        $(".lastedit").html(formatLastEdit.toLocaleString());
    }
    
    $(".edit-roster").submit(function(e) {
        e.preventDefault();
        window.location.href = '/e/' + $("#rid").val() + '/' + $("#edit-key").val() + '?t=' + Date.now();    
    });
    
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        mob = location.protocol + "//" + location.host + '/m/' + $("#rid").val();
        if (document.referrer != mob) {
            window.location.href = mob;
        }
    }
    
    // var rosterid = $("#rid").val();
    // var lastEdit = $("#lastedit-value").val();
    // path = '/api/' + rosterid;
    // $.getJSON(path, function (data) {
    //     if (lastEdit != data.lastedit && data.error != true) {
    //          location.reload();
    //     }
    // });
    
});

$('body').on('keyup', document, function(e) {
    // Show edit modal when e is pressed.
    if (e.which == 69 ) {
             $('#editkey-modal').modal('show');
    }
});