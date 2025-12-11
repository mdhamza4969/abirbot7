module.exports = {
    config: {
        name: "welcome",
        version: "1.0",
        author: "ABIR",
        category: "events"
    },

    onEvent: async ({ api, event }) => {
        try {
            const { threadID, messageID, logMessageType, logMessageData } = event;

            // চেক করা হচ্ছে কেউ অ্যাড হয়েছে কিনা
            if (logMessageType === "log:subscribe") {
                const addedParticipants = logMessageData.addedParticipants;

                if (!addedParticipants || addedParticipants.length === 0) return;

                for (const user of addedParticipants) {
                    const newUserName = user.fullName || "Unknown";
                    const newUserId = user.userID;

                    // যিনি অ্যাড করেছেন তার নাম
                    let adderName = "Unknown";
                    if (user._id) {
                        try {
                            const adder = await api.getUserInfo(user._id);
                            adderName = adder[user._id].name || "Unknown";
                        } catch (err) {
                            console.log("Error fetching adder info:", err);
                        }
                    }

                    // গ্রুপের তথ্য
                    const threadInfo = await api.getThreadInfo(threadID);
                    const groupName = threadInfo.threadName || "this group";

                    // মেসেজ বানানো
                    const welcomeMessage = `Hey ${newUserName} welcome to ${groupName}\nAdd by: ${adderName}\nUid: ${newUserId}\nFOLLOW ALL RULES 🩷\n🖤-ABIR-🖤`;

                    // মেসেজ পাঠানো
                    api.sendMessage(welcomeMessage, threadID);
                }
            }
        } catch (err) {
            console.log("Welcome event error:", err);
        }
    }
};
