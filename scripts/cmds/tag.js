module.exports = {
  config: {
    name: "tag",
    version: "1.0",
    author: "SABBIR",
    role: 0,
    shortDescription: { en: "Mention by name" },
    longDescription: { en: "Tag a user by name, reply" },
    category: "box chat",
    guide: { en: "{p}tag <name>\n{p}tag (reply/self)" }
  },

  onStart: async function ({ event, message, args, api }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const reply = event.messageReply;

    const info = await api.getThreadInfo(threadID);
    const members = info.userInfo;

    const delay = ms => new Promise(res => setTimeout(res, ms));

    let targetID = null;
    let extraText = "";

    if (args.length > 0) {
      const nameInput = args.join(" ").toLowerCase();

      const match = members.find(u =>
        u.name?.toLowerCase().includes(nameInput)
      );

      if (!match)
        return message.reply("❌ No user found with that name.");

      targetID = match.id;
    }

    else if (reply?.senderID) {
      targetID = reply.senderID;
    }

    else {
      targetID = senderID;
    }

    const targetUser = members.find(u => u.id === targetID);
    if (!targetUser) return message.reply("❌ | Cannot fetch user.");

    const tagObj = [{ id: targetID, tag: `@${targetUser.name}` }];

    return message.reply({
      body: `${extraText} ${tagObj[0].tag}`.trim(),
      mentions: tagObj
    });
  }
};
