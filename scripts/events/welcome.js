module.exports = {
    config: {
        name: "welcome",
        version: "1.0",
        author: "ABIR",
        category: "events"
    },

    onEvent: async ({ api, event }) => {
        const { threadID, logMessageType, logMessageData } = event;

        // কেউ গ্রুপে অ্যাড হলে
        if (logMessageType !== "log:subscribe") return;
        const addedUsers = logMessageData.addedParticipants;
        if (!addedUsers || addedUsers.length === 0) return;

        try {
            // গ্রুপের নাম
            const threadInfo = await api.getThreadInfo(threadID);
            const groupName = threadInfo.threadName || "this group";

            // যিনি অ্যাড করেছেন তার ID
            const actorID = logMessageData.actorFbId || event.senderID;
            let adderName = "Unknown";

            try {
                const info = await api.getUserInfo(actorID);
                if (info && info[actorID] && info[actorID].name) {
                    adderName = info[actorID].name;
                }
            } catch (err) {
                console.log("Could not fetch adder info:", err);
            }

            // নতুন ইউজারদের জন্য মেসেজ তৈরি
            for (const user of addedUsers) {
                const newUserName = user.fullName || "Unknown";
                const newUserId = user.userID || user.id || "Unknown";

                const welcomeMessage = 
`Hey ${newUserName} welcome to ${groupName}
Add by: ${adderName}
Uid: ${newUserId}
FOLLOW ALL RULES 🩷
🖤-ABIR-🖤`;

                await api.sendMessage(welcomeMessage, threadID);
            }
        } catch (error) {
            console.error("Error in welcome event:", error);
        }
    }
};
