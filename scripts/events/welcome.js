const { getTime } = global.utils;

module.exports = {
    config: {
        name: "welcome",
        version: "3.1",
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

        // Adder info
        const addedByInfo = await api.getUserInfo(addedBy);
        const addedByName = addedByInfo[addedBy].name;

        for (const user of addedMembers) {
            const name = user.fullName;
            const uid = user.userFbId;

            const messageBody =
`HEY ${name}
WELCOME TO ${threadName}
UID: ${uid}
ADD BY: ${addedByName}

PLEASE FOLLOW ALL RULES 🖤
🖤🖤🖤🖤`;

            message.send({
                body: messageBody,
                mentions: [{ tag: name, id: uid }]
            });
        }
    }
};
