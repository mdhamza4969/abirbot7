module.exports = {
  config: {
    name: "leave",
    eventType: ["log:unsubscribe"],
    version: "1.1",
    author: "ABIR BOT",
    category: "events"
  },

  onStart: async ({ api, event }) => {
    try {
      const leftUserId = event.logMessageData.leftParticipantFbId;
      const threadID = event.threadID;

      if (!leftUserId) return;

      const userInfo = await api.getUserInfo(leftUserId);
      const userName = userInfo[leftUserId].name;

      const msg = `❌ Someone left the group!\n👤 Name: ${userName}\n🆔 UID: ${leftUserId}`;

      api.sendMessage(msg, threadID);
    } catch (err) {
      console.error(err);
    }
  }
};
