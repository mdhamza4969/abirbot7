const { getTime } = global.utils;

module.exports = {
    config: {
        name: "welcome",
        version: "4.0",
        author: "ABIR EDIT",
        category: "events"
    },

    onStart: async function ({ threadsData, message, event, api }) {
        if (event.logMessageType !== "log:subscribe") return;

        const threadID = event.threadID;
        const threadData = await threadsData.get(threadID);
        const threadName = threadData.threadName;

        const addedMembers = event.logMessageData.addedParticipants;
        const addedBy = event.author;

        // Fetch adder info
        const adderInfo = await api.getUserInfo(addedBy);
        const addedByName = adderInfo[addedBy].name;

        for (const user of addedMembers) {
            const name = user.fullName;
            const uid = user.userFbId;

            const text =
`𝗛𝗘𝗬 ${name}
━━━━━━━━━━━━━━━━━━━━━━━
𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢: ${threadName}
━━━━━━━━━━━━━━━━━━━━━━━
𝗨𝗜𝗗: ${uid}
━━━━━━━━━━━━━━━━━━━━━━━
𝗔𝗗𝗗 𝗕𝗬: ${addedByName}
━━━━━━━━━━━━━━━━━━━━━━━
𝗣𝗟𝗘𝗔𝗦𝗘 𝗙𝗢𝗟𝗟𝗢𝗪 𝗔𝗟𝗟 𝗥𝗨𝗟𝗘𝗦 🖤
━━━━━━━━━━━━━━━━━━━━━━━
🖤🖤~𝗔𝗕𝗜𝗥~🖤🖤
𝗙𝗕-https://www.facebook.com/Abir419`;

            message.send({
                body: text,
                mentions: [{ tag: name, id: uid }]
            });
        }
    }
};
