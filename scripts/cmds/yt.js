module.exports = {
  config: {
    name: "yt",
    aliases: ["yt"],
    version: "2.0",
    role: 0,
    author: "kshitiz | speed optimized",
    cooldowns: 30,
    shortDescription: "Fast YouTube video",
    category: "video",
    usages: "{pn} <video name>",
    dependencies: {
      "fs-extra": "",
      "ytdl-core": "",
      "yt-search": ""
    }
  },

  onStart: async ({ api, event, args }) => {
    const fs = require("fs-extra");
    const ytdl = require("ytdl-core");
    const yts = require("yt-search");
    const path = require("path");

    if (!args.length) {
      return api.sendMessage(
        "❌ | Video name দাও\n\nExample:\nyt funny video",
        event.threadID
      );
    }

    const query = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    try {
      api.sendMessage(`⚡ Searching: ${query}`, event.threadID);

      // 🔥 FAST SEARCH (only first result)
      const res = await yts({ query, pages: 1 });
      if (!res.videos.length)
        return api.sendMessage("❌ | Video পাওয়া যায়নি", event.threadID);

      const video = res.videos[0];
      const filePath = path.join(cacheDir, `${event.senderID}.mp4`);

      // 🚀 FASTEST DOWNLOAD SETTINGS
      const stream = ytdl(video.url, {
        quality: "18", // 360p (fastest + safe)
        filter: "audioandvideo",
        highWaterMark: 1 << 25 // BIG BUFFER = FAST
      });

      stream.pipe(fs.createWriteStream(filePath));

      stream.on("end", () => {
        if (fs.statSync(filePath).size > 25 * 1024 * 1024) {
          fs.unlinkSync(filePath);
          return api.sendMessage(
            "❌ | Video size বেশি হয়ে গেছে (25MB+)",
            event.threadID
          );
        }

        api.sendMessage(
          {
            body:
              `⚡ FAST YouTube Video\n\n` +
              `🎬 ${video.title}\n` +
              `⏱ ${video.duration.timestamp}`,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });

      stream.on("error", () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        api.sendMessage("❌ | Download failed", event.threadID);
      });

    } catch (e) {
      console.log(e);
      api.sendMessage("⚠️ | Error হয়েছে, পরে ট্রাই করো", event.threadID);
    }
  }
};
