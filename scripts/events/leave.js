module.exports = {
    config: {
        name: "leave",
        version: "1.0",
        author: "ChatGPT",
        category: "events"
    },

    onStart: async ({ message, event, api, usersData }) => {
        // Check if event is leave
        if (event.logMessageType !== "log:unsubscribe") return;

        const { leftParticipantFbId } = event.logMessageData;

        // Ignore bot itself
        if (leftParticipantFbId == api.getCurrentUserID()) return;

        // Get user name
        const userName = await usersData.getName(leftParticipantFbId);

        // Create message
        const leaveMsg = `❌ Someone left the group\n\n👤 Name: ${userName}\n🆔 UID: ${leftParticipantFbId}`;

        // Send message
        message.send(leaveMsg);
    }
};
