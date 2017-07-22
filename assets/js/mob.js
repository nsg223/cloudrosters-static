$(document).ready(function() {
//    window.displayDates = displayDates();
    //Display the day in the p tag using the date.
    function displayDates() {
        $("td.date").each(function() {
            var g = $(this).children("p.date").html();
            var d = new Date(g.trim());
            var weekday = new Array(7);
            weekday[0]=  "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";

            var n = weekday[d.getDay()];
            $(this).children("h4.day").html(n);
            
            $(this).children("p.date").html(d.toLocaleDateString());
        });
    }
    
        var lastEdit = $("#lastedit-value").val();
    formatLastEdit = new Date(lastEdit);
    $(".lastedit").html(formatLastEdit.toLocaleString());

    
    $(".search-query").on("keyup", function() {
         search($(".search-query").val());
    });
    
    
    function search(query) {
        $(".employee-panel").each(function () {
            var name = $(this).children(".name").html();
            name = name.toLowerCase();
            console.log(name);
            query = query.toLowerCase();
            if (name.indexOf(query) > 0) {
                $(this).show();
            } 
            else if (query == "") {
                $(this).show();
            } else {
                $(this).hide();
            }
            
        });
    }
    
});