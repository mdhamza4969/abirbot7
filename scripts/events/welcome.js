module.exports = {
    config: {
        name: "welcome",
        version: "1.0",
        author: "ABIR",
        category: "events",
    },

    onEvent: async ({ api, event }) => {
        const { threadID, logMessageType, logMessageData } = event;

        // কেউ গ্রুপে অ্যাড হলে
        if (logMessageType === "log:subscribe") {
            const addedUsers = logMessageData.addedParticipants;
            if (!addedUsers || addedUsers.length === 0) return;

            try {
                // গ্রুপের নাম
                const threadInfo = await api.getThreadInfo(threadID);
                const groupName = threadInfo.threadName;

                for (let user of addedUsers) {
                    const newUserName = user.fullName;
                    const newUserId = user.userID;

                    // যিনি অ্যাড করেছেন তার নাম
                    let adderName = "Unknown";
                    if (logMessageData.addedParticipants.length > 0) {
                        try {
                            // প্রথম ইউজার অ্যাড করলে সাধারণত actorID যিনি অ্যাড করেছেন
                            const actorID = logMessageData.actorFbId || logMessageData.adderID || null;
                            if (actorID) {
                                const info = await api.getUserInfo(actorID);
                                adderName = info[actorID].name || "Unknown";
                            }
                        } catch (err) {
                            console.log("Error fetching adder info:", err);
                        }
                    }

                    // মেসেজ তৈরি
                    const message = `Hey ${newUserName} welcome to ${groupName}\nAdd by: ${adderName}\nUid: ${newUserId}\nFOLLOW ALL RULES 🩷\n🖤-ABIR-🖤`;

                    // মেসেজ পাঠানো
                    api.sendMessage(message, threadID);
                }
            } catch (err) {
                console.log("Welcome event error:", err);
            }
        }
    },
};
