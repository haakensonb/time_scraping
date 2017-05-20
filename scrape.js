"use strict";

var request = require('request'),
    cheerio = require('cheerio');

var args = process.argv.slice(2),
    pageUrl = args[0];


request(pageUrl, function(error, response, body){
    if (error){
        console.log("Error: " + error);
    }

    console.log("Status code: " + response.statusCode);

    var $ = cheerio.load(body);

    let times = formatTimes($);

    let minutes = [],
        seconds = [];

    times.forEach(function(time, index){
        minutes.push(time.split(':')[0]);
        seconds.push(time.split(':')[1]);
    });

    let sumMinutes = minutes.reduce((a, b) => Number(a) + Number(b), 0);

    let sumSeconds = seconds.reduce((a, b) => Number(a) + Number(b), 0);

    getTotalTime(sumMinutes, sumSeconds);
});

function getTotalTime(sumMinutes, sumSeconds){
        let minutes = sumMinutes,
            seconds = sumSeconds,
            hours = 0;

        if (minutes < 60){
            minutes += Math.floor(seconds / 60);
            seconds = sumSeconds % 60;

            return console.log("It will take you at least " + minutes + " minutes and " + seconds + " second(s) to complete this series.");
        } else {
            hours += Math.floor(minutes / 60);
            minutes = minutes % 60;
            minutes += Math.floor(seconds / 60);
            seconds = sumSeconds % 60;

            return console.log("It will take you at least " + hours + " hour(s) " + minutes + " minute(s) and " + seconds + " second(s) to complete this series.");
        }
        
    }

function formatTimes($){
    let times = $('.running-time').text();

    times = times.trim().split(/\r?\n/);

    for (let i=0; i < times.length; i++){
        times[i] = times[i].trim();
    }

    //remove whitespace entries from array
    times = times.filter(function(element){
        return element.length > 0;
    });

    //gets rid of unwanted text so that we just have times as strings
    times.forEach(function(time, index){
        times[index] = time.split(' ')[2];
    });

    return times;
}