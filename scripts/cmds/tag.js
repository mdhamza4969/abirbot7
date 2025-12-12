module.exports = {
  config: {
    name: "tag",
    version: "1.2",
    author: "SABBIR",
    role: 0,
    shortDescription: { en: "Mention user with reason" },
    longDescription: { en: "Tag a user by name or reply, plus show reason" },
    category: "box chat",
    guide: { en: "{p}tag <name> | <reason>\n{p}tag (reply) | <reason>" }
  },

  onStart: async function ({ event, message, args, api }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const reply = event.messageReply;

    if (args.length === 0)
      return message.reply("❌ Usage: tag <name> | <reason>");

    const info = await api.getThreadInfo(threadID);
    const members = info.userInfo;

    let targetID;
    let reason = "";

    // Split: name | reason
    const fullText = args.join(" ");
    const parts = fullText.split("|").map(s => s.trim());

    let nameInput = parts[0]?.toLowerCase();
    reason = parts[1] || "No reason provided";

    // Case 1: Name search
    if (nameInput && !reply) {
      const match = members.find(u =>
        u.name.toLowerCase().includes(nameInput)
      );
      if (!match) return message.reply("❌ No user found with that name.");
      targetID = match.id;
    }

    // Case 2: Reply mode
    else if (reply?.senderID) {
      targetID = reply.senderID;
      reason = parts[0] || "No reason provided"; // In reply mode, no name needed
    }

    // Case 3: Self tag fallback
    else {
      targetID = senderID;
    }

    const targetUser = members.find(u => u.id === targetID);
    if (!targetUser) return message.reply("❌ Cannot fetch user info.");

    const tagObj = [{
      id: targetID,
      tag: `@${targetUser.name}`
    }];

    return message.reply({
      body: `${tagObj[0].tag}\nReason: ${reason}`,
      mentions: tagObj
    });
  }
};
