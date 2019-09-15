"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const groupCache_1 = require("./groupCache");
const moment = require("moment");
const constants_1 = require("./constants");
let groupCache = new groupCache_1.GroupCache();
moment.relativeTimeThreshold('M', 12);
moment.relativeTimeThreshold('d', 30);
moment.relativeTimeThreshold('h', 24);
moment.relativeTimeThreshold('m', 120);
moment.relativeTimeThreshold('s', 360);
moment.relativeTimeThreshold('ss', 3);
/**
 * Creates a group in the group cache.
 *
 * Message format: ".create gameName | YYYY-mm-dd HH:mm (| maxPlayers)"
 * For example: ".create Final Fantasy XIV | 2020-01-05 13:00"
 *           or ".create Overwatch | 2020-10-21 15:00 | 6"
 * @param message
 * @param config
 * @param resolve
 */
const createPromise = (message, config, resolve) => {
    //Remove command by removing all before first space
    const q = message.content.substring(message.content.indexOf(' ')).trim();
    const params = q.split('|').map(arg => arg.trim());
    try {
        if (params.length < 2) {
            throw new Error('Incorrect command format. Type ".help" for example commands.');
        }
        const gameName = params[0];
        const startTime = moment(params[1], constants_1.DATE_FORMAT, true);
        let maxPlayers = params[2] ? parseInt(params[2]) : 0;
        if (!startTime.isValid()) {
            console.log(`"${params[1]}"`);
            throw new Error(`Incorrect date format. Dates must be in "${constants_1.DATE_FORMAT}" format.`);
        }
        if (Number.isNaN(maxPlayers)) {
            maxPlayers = 0;
        }
        let groupId = groupCache.create(message.author.id, gameName, maxPlayers, startTime);
        message.channel.send(`Group created!\n\n${groupCache.print(message.guild.members, groupId)}`);
    }
    catch (e) {
        message.channel.send(`Error: ${e.message}`);
    }
    resolve(groupCache);
};
const removePromise = (message, config, resolve) => {
    try {
        //Remove command by removing all before first space
        const q = message.content.substring(message.content.indexOf(' ')).trim();
        const params = q.split(' ').map(arg => arg.trim());
        let groupId = -1;
        for (let i = 0; i < params.length; i++) {
            let possibleGroupId = Number.parseInt(params[i]);
            if (Number.isInteger(possibleGroupId)) {
                groupId = possibleGroupId;
                break;
            }
        }
        var group = groupCache.remove(message.author.id, groupId);
        if (!group) {
            throw new Error("Group deletion unsuccessful.");
        }
        message.channel.send(`**Successfully removed the following group:**\n\n${group.print(message.guild.members)}`);
    }
    catch (e) {
        message.channel.send(`Error: ${e.message}`);
    }
    resolve(groupCache);
};
const joinPromise = (message, config, resolve) => {
    try {
        //Remove command by removing all before first space
        const q = message.content.substring(message.content.indexOf(' ')).trim();
        const params = q.split(' ').map(arg => arg.trim());
        let groupId = -1;
        for (let i = 0; i < params.length; i++) {
            let possibleGroupId = Number.parseInt(params[i]);
            if (Number.isInteger(possibleGroupId)) {
                groupId = possibleGroupId;
                break;
            }
        }
        var group = groupCache.joinGroup(message.author.id, groupId);
        message.channel.send(`**Successfully joined the following group:**\n\n${groupCache.print(message.guild.members, groupId)}`);
    }
    catch (e) {
        message.channel.send(`Error: ${e.message}`);
    }
    resolve(groupCache);
};
const leavePromise = (message, config, resolve) => {
    try {
        //Remove command by removing all before first space
        const q = message.content.substring(message.content.indexOf(' ')).trim();
        const params = q.split(' ').map(arg => arg.trim());
        let groupId = -1;
        for (let i = 0; i < params.length; i++) {
            let possibleGroupId = Number.parseInt(params[i]);
            if (Number.isInteger(possibleGroupId)) {
                groupId = possibleGroupId;
                break;
            }
        }
        var group = groupCache.leaveGroup(message.author.id, groupId);
        message.channel.send(`**Successfully left the following group:**\n\n${groupCache.print(message.guild.members, groupId)}`);
    }
    catch (e) {
        message.channel.send(`Error: ${e.message}`);
    }
    resolve(groupCache);
};
const listPromise = (message, config, resolve) => {
    let output = groupCache.printAll(message.guild.members);
    message.channel.send(output);
    resolve(output);
};
function create(message, config) {
    return new Promise((resolve) => {
        createPromise(message, config, resolve);
    });
}
exports.create = create;
function remove(message, config) {
    return new Promise((resolve) => {
        removePromise(message, config, resolve);
    });
}
exports.remove = remove;
function join(message, config) {
    return new Promise((resolve) => {
        joinPromise(message, config, resolve);
    });
}
exports.join = join;
function leave(message, config) {
    return new Promise((resolve) => {
        leavePromise(message, config, resolve);
    });
}
exports.leave = leave;
function list(message, config) {
    return new Promise((resolve) => {
        listPromise(message, config, resolve);
    });
}
exports.list = list;
