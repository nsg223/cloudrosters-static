$(document).ready(function() {

    $(".create-form").submit(function(e) {
        e.preventDefault();
        nd = {};
        nd.name = $("#new-roster-name").val();
        nd.date = $("#new-roster-date").val();
        nd.editkey = $("#new-roster-editkey").val();
        nd.email = $("#new-roster-email").val();
        nd.mailing = $("#mailing-list").val();

        $.ajax({
            url: "/r/create",
            type: "post",
            data: JSON.stringify(nd),
            processData: false,
            dataType: "json",
            contentType: "application/json"
        }).done(function(data) {
            ga('send', 'event', 'Create', 'Roster');
            window.location = "/e/" + data.url;
        }).error(function(data) {
            $("#submit-button").removeClass("btn-success");
            $("#submit-button").addClass("btn-danger");

        });

    });

    $(".view-form form").submit(function(e) {
        e.preventDefault();
        var rid = $("#roster-id-input").val();
        if (rid) {
            window.location = "/r/" + rid + '?t=' + Date.now();
        }
    });

    // Datepicker
    $(function() {
        $('.datepicker').datepicker({
            inline: true,
            showOtherMonths: true,
            dateFormat: "D d M yy"
        })
    });

    $(".view-display").click(function() {
        $(".view-form").removeClass("hidden-form");
        $("#roster-id-input").focus();
    });



});

$('body').on('keyup', '.wrapper', function(e) {
    // Down Arrow
    if (e.which == 86) {
        $('.view-display').click();
    }
});