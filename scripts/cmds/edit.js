const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const mahmud = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "edit",
    version: "2.1",
    author: "MahMUD",
    countDown: 10,
    role: 0,
    category: "image",
    guide: {
      en:
        "{p}edit enhance (reply image)\n" +
        "{p}edit blur (reply image)\n" +
        "{p}edit 8k (reply image)"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
    if (module.exports.config.author !== obfuscatedAuthor) {
      return message.reply("❌ | Author change is not allowed.");
    }

    const type = args[0]?.toLowerCase();
    const repliedImage = event.messageReply?.attachments?.[0];

    if (!repliedImage || repliedImage.type !== "photo") {
      return message.reply("📸 | অনুগ্রহ করে একটি ছবিতে reply দাও।");
    }

    if (!["enhance", "blur", "8k"].includes(type)) {
      return message.reply(
        "⚙️ | ব্যবহার নিয়ম:\n\n" +
        "edit enhance\n" +
        "edit blur\n" +
        "edit 8k\n\n" +
        "➡ অবশ্যই ছবিতে reply দিতে হবে"
      );
    }

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const imgPath = path.join(cacheDir, `${Date.now()}_${type}.jpg`);

    const waitMsg = await message.reply("🪄 | আপনার ফটো প্রসেস করা হচ্ছে...");

    try {
      const baseURL = await mahmud();

      const res = await axios.post(
        `${baseURL}/api/image/${type}`,
        {
          imageUrl: repliedImage.url
        },
        { responseType: "arraybuffer" }
      );

      await fs.writeFile(imgPath, Buffer.from(res.data));

      let text = "✅ | Image processed successfully";
      if (type === "enhance") text = "✨ | Photo enhanced successfully";
      if (type === "blur") text = "🌀 | Background blur done";
      if (type === "8k") text = "🖼️ | Photo upscaled to 8K";

      await message.reply({
        body: text,
        attachment: fs.createReadStream(imgPath)
      });
    } catch (err) {
      console.error(err);
      message.reply("🥹 | দুঃখিত, ফটো প্রসেস করা যায়নি। পরে আবার চেষ্টা করো।");
    } finally {
      setTimeout(() => fs.remove(imgPath).catch(() => {}), 15000);
      if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
    }
  }
};
