const fs = require("fs");

module.exports = {
    config: {
        name: "leave",
        version: "2.0",
        author: "ChatGPT",
        category: "events"
    },

    onStart: async ({ message, event, api, usersData }) => {
        if (event.logMessageType !== "log:unsubscribe") return;

        const { threadID } = event;
        const { leftParticipantFbId } = event.logMessageData;

        // ignore bot
        if (leftParticipantFbId == api.getCurrentUserID()) return;

        const userName = await usersData.getName(leftParticipantFbId);
        const threadInfo = await api.getThreadInfo(threadID);
        const groupName = threadInfo.threadName;

        const leaveMsg =
`${userName} 𝗟𝗘𝗙𝗧 𝗧𝗛𝗘 𝗚𝗥𝗢𝗨𝗣 (${groupName})

𝗨𝗜𝗗: ${leftParticipantFbId}

𝗔𝗚𝗔𝗜𝗡 𝗔𝗗𝗗 - 𝗥𝗘𝗔𝗖𝗧 𝗧𝗛𝗜𝗦 𝗠𝗔𝗦𝗦𝗔𝗚𝗘 🖤🥀`;

        message.send(leaveMsg, (err, info) => {
            if (err) return;

            // save data for reaction add
            global.leaveReactData = global.leaveReactData || {};
            global.leaveReactData[info.messageID] = {
                uid: leftParticipantFbId,
                threadID
            };
        });
    },

    onReaction: async ({ event, api }) => {
        const data = global.leaveReactData?.[event.messageID];
        if (!data) return;

        try {
            await api.addUserToGroup(data.uid, data.threadID);
            delete global.leaveReactData[event.messageID];
        } catch (e) {
            console.log("Failed to re-add user:", e.message);
        }
    }
};
