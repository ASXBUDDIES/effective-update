var tweets = Array(0);
var graph;
var GET;
var config = Object();
var teamHashtags = Array();
var teamScores = Array();
var backgroundColors = Array();
var borderColors = Array();

$(function() {
    var url = Qurl.create();
    GET = url.query();
    
    storeConfig();
    setTitles();
    generateColors();
    
    var ctx = $("#chart");
    window.graph = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: teamHashtags,
        datasets: [{
            label: 'Points',
            data: teamScores,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
        }]
    },
    options: {
        legend: {
                display: false
            },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
        maintainAspectRatio: false,
    }
});
    
    console.log(window.graph);
    
    getNewTweets();
    cycleTweets();
    countScore();
    window.setInterval(function() {
        getNewTweets();
        cycleTweets();
        countScore();
    }, 10000);
});

function addTweet(profileUrl, text, imageUrl) {
    $(".tweetHolder").append([
        '<div class="tweet animated bounceInRight">',
            '<div class="topRow">',
                '<img src="' + profileUrl + '" class="profilePic">',
                '<div class="rightHolder">',
                    '<p class="tweetText">',
                    text,
                    '</p>',
                '</div>',
            '</div>',
            '<div class="imageRow">',
                '<img class="tweetImage" src="' + imageUrl + '">',
            '</div>',
        '</div>'
    ].join(""));
}

function addTweets() {
    var chosenNumbers = [0,1,2];
    for (var i = 0; i<3; i++) {
        var randomIndex = Math.floor(Math.random()*tweets.length);

        while (chosenNumbers.includes(randomIndex)) {
            randomIndex = Math.floor(Math.random()*tweets.length);
        }

        var tweet = tweets[randomIndex];

        if (tweet.entities.media == undefined) {
            addTweet(tweet.user.profile_image_url, tweet.text, '');
        } else {
            addTweet(tweet.user.profile_image_url, tweet.text, tweet.entities.media[0].media_url);
        }
        chosenNumbers[i] = randomIndex;
    }
}

function removeTweets() {
    $(".tweet").addClass('animated bounceOutLeft');
    $('.tweet').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $('.tweet').remove();
        addTweets();
    });
}

function getNewTweets() {
    $.post('/getTweets', {
        'query': config.eventHashTag
    }, function(data) {
        data = JSON.parse(data);
        var duplicate = false;
        data.statuses.forEach(function(grabbedTweet) {
            tweets.forEach(function(storedTweet) {
                if (storedTweet.id == grabbedTweet.id) {
                    duplicate = true;
                }
            });
            if (!duplicate) {
                tweets.push(grabbedTweet);
            }
        });
    });
}

function cycleTweets() {
    if (tweets.length >= 3) {
        removeTweets();
    }
}

function containsHashtag(tweet, hashtag) {
    if (tweet.entities.hashtags.some(function(tag) {
        if (hashtag.toLocaleLowerCase() === "#" + tag.text.toLocaleLowerCase()) {
            return true;
        } else {
            return false;
        }
    })) {
        return true;
    } else {
        return false;
    }
}

function countScore() {
    var graphData = window.graph.config.data.datasets[0].data;
    
    config.teamData.forEach(function(team) {
        team.score = 0;
    });
    tweets.forEach(function(tweet) {
        config.teamData.forEach(function(team) {
            if (containsHashtag(tweet, team.hashtag)) {
                team.tasks.forEach(function(task) {
                    if (containsHashtag(tweet, task.hashtag)) {
                        task.completed = true;
                        team.score += parseInt(task.points);
                    }
                });
            }
        });
    });
    for (var i=0; i<graphData.length; i++) {
        graphData[i] = config.teamData[i].score;
    }
    graph.update();
    console.log(tweets);
}

function storeConfig() {

    config.teamData = [];
    var GETtaskHashtags = [];
    var GETtaskPoints = [];
    var GETteamHashtags = [];
    
    var tasks = [];
    
    var i = 0;
    
    _.each(GET, function(item, key) {
        
        if (key.includes("eventHashtag")) {
            config.eventHashTag = item;
        } else if (key.includes("eventName")) {
            config.eventName = item;
        } else if (key.includes("taskHashtag")) {
            GETtaskHashtags.push(item);
        } else if (key.includes("taskPoints")) {
            GETtaskPoints.push(item);
        } else if (key.includes("teamHashtag")) {
            GETteamHashtags.push(item);
        }
        
    });
    
    GETtaskHashtags.forEach(function(item) {
        tasks[i] = {
            hashtag: item,
            points: GETtaskPoints[i],
            completed: false
        };
        i++;
    });
    
    i = 0;
    
    GETteamHashtags.forEach(function(item) {
        config.teamData[i] = {
            hashtag: item,
            tasks: tasks,
            score: 0
        };
        i++;
    });
    
    teamHashtags = GETteamHashtags;
    teamScores = Array(GETteamHashtags.length);
}

function setTitles() {
    var title = config.eventName.replace(/\+/g," ");
    var mainHashtag = config.eventHashTag;
    
    $(".mainTitle").empty();
    $(".mainTitle").append(title);
    
    $(".mainHashtags").empty();
    $(".mainHashtags").append(mainHashtag + " | #TEAMNAME | #TASKNAME");
}

function generateColors() {
    var i = 0;
    teamHashtags.forEach(function(item) {
        var randomColor = "rgba(" + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255);
        backgroundColors.push(randomColor + ", 0.4)");
        borderColors.push(randomColor + ", 1)");
        i++;
    });
    console.log(window.graph);
}