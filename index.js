require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;

const bot = new Telegraf(process.env.BOT_TOKEN);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

bot.command("ss", async (ctx) => {
  try {
    const html = `
      <html>
      <body style="font-family: sans-serif; background: #f3f3f3; padding: 20px">
        <div style="background: white; padding: 15px; border-radius: 10px; max-width: 400px;">
          <p><b>@katya:</b> Привет! Видел новый сайт?</p>
          <p><b>@peaceup:</b> Да, лайки теперь сохраняются навсегда 😎</p>
          <p><b>@katya:</b> Топ, спасибо!</p>
        </div>
      </body>
      </html>
    `;

    const response = await axios.post(
      "https://hcti.io/v1/image",
      { html },
      {
        auth: {
          username: process.env.HCTI_USER_ID,
          password: process.env.HCTI_API_KEY,
        },
      }
    );

    const imageUrl = response.data.url;

    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: "chat-screens",
    });

    await ctx.replyWithPhoto(uploadResult.secure_url);
  } catch (err) {
    console.error(err);
    ctx.reply("Произошла ошибка при создании скрина.");
  }
});

bot.launch();
console.log("Бот запущен 🚀");
