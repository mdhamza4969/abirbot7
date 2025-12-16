module.exports = {
  config: {
    name: "tag",
    version: "1.5",
    author: "SABBIR",
    role: 0,
    shortDescription: { en: "Tag user with auto reason format" },
    longDescription: { en: "Tag user by first name and auto show 📌reason" },
    category: "box chat",
    guide: { en: "{p}tag <user first name> <reason>" }
  },

  onStart: async function ({ event, message, args, api }) {
    const threadID = event.threadID;

    if (args.length < 2)
      return message.reply("❌ Usage: tag <name> <reason>");

    const info = await api.getThreadInfo(threadID);
    const members = info.userInfo;

    // First word = user first name
    const nameInput = args[0].toLowerCase();

    // Rest words = reason
    const reason = args.slice(1).join(" ");

    // Find user
    const match = members.find(u =>
      u.name.toLowerCase().includes(nameInput)
    );

    if (!match)
      return message.reply("❌ No user found with that name.");

    return message.reply({
      body: `@${match.name}\n📌reason: ${reason}`,
      mentions: [{ id: match.id, tag: `@${match.name}` }]
    });
  }
};
