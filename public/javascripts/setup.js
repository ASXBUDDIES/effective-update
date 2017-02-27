$(function() {
    $(".numberOfTasks").on("change paste keyup", function() {
       console.log("Updating Questions");
        var number = $(".numberOfTasks").val();

        $(".taskHolder").empty();

        for (var i=0; i<number; i++) {
            $(".taskHolder").append([
                '<div class="task">',
                    '<label>Task Hashtag</label>',
                    '<input name="taskHashtag' + i + '"', 'placeholder="e.g. #tallbuilding">',
                    '<label>Points Awarded:</label>',
                    '<input name="taskPoints' + i + '" placeholder="e.g. 20">',
                '</div>'
            ].join(""));
        }
    });

    $(".numberOfTeams").on("change paste keyup", function() {
       console.log("Updating Questions");
        var number = $(".numberOfTeams").val();

        $(".teamHolder").empty();

        for (var i=0; i<number; i++) {
            $(".teamHolder").append([
                '<div class="team">',
                    '<label>Team Hashtag</label>',
                    '<input name="teamHashtag' + i + '"', 'placeholder="e.g. #teamdynamite">',
                '</div>'
            ].join(""));
        }
    });
});