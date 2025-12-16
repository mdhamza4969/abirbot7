module.exports = {
    config: {
        name: "leave",
        version: "2.1",
        author: "ChatGPT",
        category: "events"
    },

    onStart: async ({ message, event, api, usersData }) => {
        if (event.logMessageType !== "log:unsubscribe") return;

        const { threadID } = event;
        const { leftParticipantFbId } = event.logMessageData;

        // bot ignore
        if (leftParticipantFbId == api.getCurrentUserID()) return;

        const userName = await usersData.getName(leftParticipantFbId);
        const threadInfo = await api.getThreadInfo(threadID);
        const groupName = threadInfo.threadName || "This Group";

        const msg =
`${userName} 𝗟𝗘𝗙𝗧 𝗧𝗛𝗘 𝗚𝗥𝗢𝗨𝗣 (${groupName})
𝗨𝗜𝗗: ${leftParticipantFbId}

👉 𝗥𝗘𝗔𝗖𝗧 𝗧𝗛𝗜𝗦 𝗠𝗘𝗦𝗦𝗔𝗚𝗘  
🤖 Bot will auto add user again`;

        message.send(msg, (err, info) => {
            if (err) return;

            // save for reaction
            global.leaveAutoAdd = global.leaveAutoAdd || {};
            global.leaveAutoAdd[info.messageID] = {
                uid: leftParticipantFbId,
                threadID
            };
        });
    },

    onReaction: async ({ event, api }) => {
        const data = global.leaveAutoAdd?.[event.messageID];
        if (!data) return;

        try {
            await api.addUserToGroup(data.uid, data.threadID);
            delete global.leaveAutoAdd[event.messageID];
        } catch (err) {
            console.log("Auto add failed:", err.message);
        }
    }
};
