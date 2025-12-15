module.exports = {
  config: {
    name: "tag",
    version: "1.4",
    author: "SABBIR",
    role: 0,
    shortDescription: { en: "Tag user with 📌 reason" },
    longDescription: { en: "Tag a user by first name and show 📌 reason" },
    category: "box chat",
    guide: { en: "{p}tag <user first name> 📌<reason>" }
  },

  onStart: async function ({ event, message, args, api }) {
    const threadID = event.threadID;

    if (args.length < 2)
      return message.reply("❌ Usage: tag <name> 📌<reason>");

    const info = await api.getThreadInfo(threadID);
    const members = info.userInfo;

    const fullText = args.join(" ");

    // Split by 📌
    const parts = fullText.split("📌").map(t => t.trim());

    if (parts.length < 2)
      return message.reply("❌ Please use 📌 before reason.");

    const nameInput = parts[0].toLowerCase();
    const reason = parts[1] || "No reason provided";

    // Find user by first name
    const match = members.find(u =>
      u.name.toLowerCase().includes(nameInput)
    );

    if (!match)
      return message.reply("❌ No user found with that name.");

    return message.reply({
      body: `@${match.name}\n📌 Reason: ${reason}`,
      mentions: [{ id: match.id, tag: `@${match.name}` }]
    });
  }
};
