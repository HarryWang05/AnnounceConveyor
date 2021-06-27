const fs = require("fs");

const Discord = require("discord.js");
const cron = require("cron");
const client = new Discord.Client();

const {
    token,
} = require("./token.json");

client.commands = new Discord.Collection();


client.on("ready", () => {
    console.log("Ready!");
    client.user.setActivity("Type "+prefix+"help to get bot functions");
});

class setAnnounces {
    constructor() {
        this.announces = [];
    }
    newCron(timeInfo,identify,passRepeat) {
        announceChannel.send("Identfy"+identify);
        let a = new cron.CronJob(timeInfo,() => testTime(identify,passRepeat));
        this.announces.push(a);
        //return a;
    }
    get returnAll() {
        return this.announces;
    }
    /*get announceNum() {
        return this.announces.length;
    }*/
}

function testTime(passIndentify, passRepeatType) {
    announceChannel.send("passIndentify"+passIndentify);
    let index = announceList.indexOf(passIndentify);
    let messageOut = announceContent[index];
    try {
        announceChannel.send(messageOut);
    } catch {
        message.channel.send(messageOut);
    }
    if(passRepeatType == "once") {
        allAnnounces.announces[index].stop();
        allAnnounces.announces[index].stop();
        announceList.splice(index);
        announceContent.splice(index);
    }
}

let allAnnounces = new setAnnounces();
var announceChannel;
var dayOfWeek;
var prefix = "?";
const announceList = [];
const announceContent = [];

client.on("message", message => {

    if(message.content == "end") {
        console.log(nicernice);
    }

    //Message to console
    console.log(message.content);

    //If the message doesn't start with prefix it exits
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.map(x => x.toLowerCase());

    //commands

    //ANNOUNCE
    testAnnounce: if (command[0] == "ann") {
        if (announceChannel == undefined) {
            message.channel.send("You must specify an announcement channel");
            break testAnnounce;
        }
        const announceName = command[1];
        const repeatType = command[2];
        const commander = command.map(x => x);

        if(announceList.includes(announceName)) {
            message.channel.send("Announcement name is already taken!");
            break testAnnounce;
        }
        //try {
        dayOfWeek = "*";
        if (!(commander[2] == "once" || commander[2] == "daily")) {
            dayOfWeek = commander[2];
        }
        let confirmMessage = "Announcement '"+announceName+"' set at " + commander[3] + ":" + commander[4] + ":" + commander[5];
        let passAnnounce = commander[5] + " " + commander[4] + " " + commander[3] + " * * " + dayOfWeek;
        for(let i = 0; i < 6; ++i) {
            commander.shift();
        }
        let stringCommander = commander.join();
        announceContent.push(stringCommander);
        announceList.push(announceName);
        allAnnounces.newCron(passAnnounce,announceName,repeatType);
        allAnnounces.returnAll[announceList.length-1].start();
        message.channel.send(confirmMessage);
        //} catch {
            //message.channel.send("Something went wrong. This might be because you formatted the 'ann' command incorrectly.")
        //}
    }

    //CHANNEL SETTERS
	else if (command[0] == "set") {
        announceChannel = client.channels.cache.get(message.channel.id);
        announceChannel.send("Announcements Channel set!");
	}

    //DATE
    else if (command[0] == "date") {
        message.channel.send(Date());
    }

    //Change prefix
    else if (command[0] == "prefix") {
        prefix = command[2];
        message.channel.send("Predix has been changed to '"+prefix+"'");
    }

    //Lists set announcements
    else if (command[0] == "list") {
        if(announceList.length == 0) {
            message.channel.send("There are no set announcements!")
            break testAnnounce;
        }
        let listString = "";
        for(let x of announceList) {
            listString += x + " ";
        }
        message.channel.send(listString.trim());
    }

    //About
    else if (command[0] == "about") {
        message.channel.send({
            embed: {
                "title": "About",
                "description": '**Based off a hackathon project\n\nProfile image by [mohamed Hassan](https://pixabay.com/users/mohamed_hassan-5229782/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2382008) from [Pixabay](https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2382008)**',
                "color": "#8AE7E7",
            }
        });
    }

    //HELP
    else if (command[0] == "help") {
        if (command[1] == undefined) {
            message.channel.send({
                embed: {
                    "title": "List of Bot Commands",
                    "description": '**Utility:\nset, ann (once, daily, weekly), date\n\nMisc:\nabout**\n\n' + prefix + '**help <command_name>" to get specific details.**',
                    "color": "#8AE7E7",
                }
            })
        } else if (command[1] == "set") {
            message.channel.send("Sets the announcements channel");
        } else if (command[1] == "date") {
            message.channel.send("Sends the current date");
        } else if (command[1] == "ann") {
            if (command[2] == "once") {
                message.channel.send("Sets an announcement that only runs once to the announcements channel at a certain time\n${prefix}ann <announcement_name> once <hour(24)> <minuite> <second> <multi-word_message>\ne.g. ${prefix}ann firstAnnouncement once 18 22 00 hello everyone\nThis will print an announcement that says 'hello everyone' at the next 18:22:00");
            } else if (command[2] == "daily") {
                message.channel.send("Sets a daily announcement to the announcements channel at a certain time\n${prefix}ann <announcement_name> once <hour(24)> <minuite> <second> <multi-word_message>\ne.g. ${prefix}ann firstAnnouncement once 18 22 00 hello everyone\nThis will print an announcement that says 'hello everyone' every day at 18:22:00");
            } else if (command[2] == "weekly") {
                message.channel.send("Sets a weekly announcement to the announcements channel at the set time e.g. ${prefix}ann announceName daynumber (Monday 1, Tuesday 2, ... Sunday 7) hour minuite second message, EX. ${prefix}announce name 6 18 22 00 hello\nThis will print an announcement every Saturday set at 18 22 00 that says hello");
            //} else if (command[2] == "specific_once") {
                //message.channel.send("Sets an announcement that only runs once at a certain day and time of a year, either once of ")
            //}
            } else {
                message.channel.send("Specify repeat type, once, daily, weekly? e.g. help ann <repeat_type>");
            }
        } else if (command[1] == "prefix") {
            message.channel.send("Changes prefix\n${prefix}prefix <new_prefix>\ne.g. ${prefix}prefix !");
        } else if (command[1] == "list") {
            message.channel.send("Lists all set announcements");
        } else {
            message.channel.send("There is no info on that command. It probably doesn't exist.");
        }
    }
});

client.login(token);