var tweets = Array(0);
var graph;
var teamTasks = [
    {
        hashtag: '#river',
        completed: false
    },
    {
        hashtag: '#wave',
        completed: false
    },
    {
        hashtag: '#arm',
        completed: false
    },
    {
        hashtag: '#ceiling',
        completed: false
    },
    {
        hashtag: '#cat',
        completed: false
    },
];
var teamData = [
    {
        hashtag: '#fireants',
        tasks: teamTasks,
        score: 0
    },
    {
        hashtag: '#ELITE',
        tasks: teamTasks,
        score: 0
    },
    {
        hashtag: '#largemammals',
        tasks: teamTasks,
        score: 0
    },
    {
        hashtag: '#cemungutmama',
        tasks: teamTasks,
        score: 0
    },
    {
        hashtag: '#UTS',
        tasks: teamTasks,
        score: 0
    },
    {
        hashtag: '#spokenderp',
        tasks: teamTasks,
        score: 0
    },
    {
        hashtag: '#milkobar',
        tasks: teamTasks,
        score: 0
    },
    {
        hashtag: '#controlfreeks',
        tasks: teamTasks,
        score: 0
    },
];

var teamHashtags = Array();
teamData.forEach(function(team) {
    teamHashtags.push(team.hashtag);
});

var teamScores = Array();
teamData.forEach(function(team) {
    teamScores.push(team.score);
});

var query = "#movie";

$(function() {
    var ctx = $("#chart");
    window.graph = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: teamHashtags,
        datasets: [{
            label: '# of Votes',
            data: teamScores,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
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
        'query': query
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
    
    teamData.forEach(function(team) {
        team.score = 0;
    });
    tweets.forEach(function(tweet) {
        teamData.forEach(function(team) {
            if (containsHashtag(tweet, team.hashtag)) {
                team.tasks.forEach(function(task) {
                    if (containsHashtag(tweet, task.hashtag)) {
                        task.completed = true;
                        team.score += 10;
                    }
                });
            }
        });
    });
    for (var i=0; i<graphData.length; i++) {
        graphData[i] = teamData[i].score;
    }
    graph.update();
    console.log(tweets);
}