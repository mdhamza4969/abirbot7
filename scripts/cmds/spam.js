module.exports = {
  config: {
    name: "spam",
    author: "kim/zed (updated)",
    role: 2,
    shortDescription: "Send bulk spam messages",
    longDescription: "Send same message multiple times at once",
    category: "sophia",
    guide: "{pn} [amount] [message]"
  },

  onStart: async function ({ api, event, args }) {
    const amount = parseInt(args[0]);
    const message = args.slice(1).join(" ");

    const MAX_LIMIT = 100000;

    if (isNaN(amount) || amount <= 0 || !message) {
      return api.sendMessage(
        "❌ Usage:\nspam [amount] [message]\nExample:\nspam 10 Hello",
        event.threadID
      );
    }

    if (amount > MAX_LIMIT) {
      return api.sendMessage(
        `⚠️ Maximum spam limit is ${MAX_LIMIT}`,
        event.threadID
      );
    }

    for (let i = 0; i < amount; i++) {
      api.sendMessage(message, event.threadID);
    }
  }
};
