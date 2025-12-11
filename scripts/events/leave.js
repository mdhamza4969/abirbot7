const { getTime, drive } = global.utils;

module.exports = {
    config: {
        name: "leave",
        version: "1.6",
        author: "NTKhang + Updated by ChatGPT",
        category: "events"
    },

    langs: {
        vi: {
            session1: "sáng",
            session2: "trưa",
            session3: "chiều",
            session4: "tối",
            leaveType1: "tự rời",
            leaveType2: "bị kick",
            defaultLeaveMessage: "{userName} (UID: {uid}) đã {type} khỏi nhóm"
        },
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            leaveType1: "left",
            leaveType2: "was kicked from",
            defaultLeaveMessage: "{userName} (UID: {uid}) {type} the group"
        }
    },

    onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
        if (event.logMessageType !== "log:unsubscribe") return;

        const { threadID } = event;
        const threadData = await threadsData.get(threadID);
        if (!threadData.settings.sendLeaveMessage) return;

        const { leftParticipantFbId } = event.logMessageData;
        if (leftParticipantFbId == api.getCurrentUserID()) return;

        const hours = getTime("HH");
        const threadName = threadData.threadName;
        const userName = await usersData.getName(leftParticipantFbId);

        let leaveMessage = threadData.data.leaveMessage || getLang("defaultLeaveMessage");

        // Replace placeholders
        leaveMessage = leaveMessage
            .replace(/\{userName\}|\{userNameTag\}/g, userName)
            .replace(/\{uid\}/g, leftParticipantFbId)
            .replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
            .replace(/\{threadName\}|\{boxName\}/g, threadName)
            .replace(/\{time\}/g, hours)
            .replace(/\{session\}/g, hours <= 10 ? getLang("session1") : hours <= 12 ? getLang("session2") : hours <= 18 ? getLang("session3") : getLang("session4"));

        const form = { body: leaveMessage };

        // Handle mentions
        if (leaveMessage.includes("{userNameTag}")) {
            form.mentions = [{ id: leftParticipantFbId, tag: userName }];
        }

        // Handle attachments
        if (threadData.data.leaveAttachment && Array.isArray(threadData.data.leaveAttachment)) {
            const attachments = await Promise.all(
                threadData.data.leaveAttachment.map(file => drive.getFile(file, "stream").catch(() => null))
            );
            form.attachment = attachments.filter(Boolean);
        }

        await message.send(form);
    }
};
