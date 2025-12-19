let messageCounts = {};
let spamDetectionEnabled = true;

const spamThreshold = 5; // spam message limit
const spamInterval = 30000; // 60 sec

module.exports = {
  config: {
    name: "spamkick",
    aliases: ["antikick"],
    version: "2.1",
    author: "Updated by ChatGPT"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID } = event;

    if (args[0] === "on") {
      spamDetectionEnabled = true;
      return api.sendMessage("🟢 Spam detection ENABLED", threadID);
    }

    if (args[0] === "off") {
      spamDetectionEnabled = false;
      return api.sendMessage("🔴 Spam detection DISABLED", threadID);
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, senderID } = event;

    if (!spamDetectionEnabled) return;

    if (!messageCounts[threadID]) messageCounts[threadID] = {};

    if (!messageCounts[threadID][senderID]) {
      messageCounts[threadID][senderID] = {
        count: 1,
        timer: setTimeout(() => {
          delete messageCounts[threadID][senderID];
        }, spamInterval)
      };
    } else {
      messageCounts[threadID][senderID].count++;
    }

    // 🚨 Spam detected
    if (messageCounts[threadID][senderID].count >= spamThreshold) {
      clearTimeout(messageCounts[threadID][senderID].timer);
      delete messageCounts[threadID][senderID];

      try {
        await api.removeUserFromGroup(senderID, threadID);
        api.sendMessage(
          `🛡 | Spam detected!\nUser has been kicked.\nUid-${senderID}`,
          threadID
        );
      } catch (err) {
        api.sendMessage(
          `⚠️ | Spam detected but I don't have admin permission.\nUid-${senderID}`,
          threadID
        );
      }
    }
  }
};
