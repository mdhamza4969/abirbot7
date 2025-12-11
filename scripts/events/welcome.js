module.exports = {
    config: {
        name: "groupEvents",
        version: "1.0",
        author: "ABIR",
        category: "events"
    },

    onEvent: async ({ api, event }) => {
        try {
            const { threadID, logMessageType, logMessageData } = event;

            // গ্রুপে নতুন কেউ অ্যাড হলে
            if (logMessageType === "log:subscribe") {
                const addedUsers = logMessageData.addedParticipants;
                if (!addedUsers || addedUsers.length === 0) return;

                const threadInfo = await api.getThreadInfo(threadID);
                const groupName = threadInfo.threadName || "this group";

                // যিনি অ্যাড করেছেন
                const actorID = logMessageData.actorFbId || event.senderID;
                let adderName = "Unknown";
                try {
                    const info = await api.getUserInfo(actorID);
                    adderName = info[actorID] ? info[actorID].name : "Unknown";
                } catch (err) {}

                for (const user of addedUsers) {
                    const newUserName = user.fullName || "Unknown";
                    const newUserId = user.userID || user.id || "Unknown";

                    const welcomeMessage = 
`Hey ${newUserName} welcome to ${groupName}
Add by: ${adderName}
Uid: ${newUserId}
FOLLOW ALL RULES 🩷
🖤-ABIR-🖤`;

                    api.sendMessage(welcomeMessage, threadID);
                }
            }

            // গ্রুপ থেকে কেউ বের হলে
            if (logMessageType === "log:unsubscribe") {
                const leftUsers = logMessageData.leftParticipants;
                if (!leftUsers || leftUsers.length === 0) return;

                const threadInfo = await api.getThreadInfo(threadID);
                const groupName = threadInfo.threadName || "this group";

                // যিনি বের করেছেন বা চলে গেছেন
                const actorID = logMessageData.actorFbId || event.senderID;
                let adderName = "Unknown";
                try {
                    const info = await api.getUserInfo(actorID);
                    adderName = info[actorID] ? info[actorID].name : "Unknown";
                } catch (err) {}

                for (const user of leftUsers) {
                    const leftUserName = user.fullName || "Unknown";
                    const leftUserId = user.userID || user.id || "Unknown";

                    const leaveMessage = 
`${leftUserName} has left ${groupName}
Left by: ${adderName}
Uid: ${leftUserId}
GOODBYE 🖤`;

                    api.sendMessage(leaveMessage, threadID);
                }
            }

        } catch (err) {
            console.error("Group events error:", err);
        }
    }
};
