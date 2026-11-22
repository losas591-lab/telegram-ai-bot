import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful Telegram AI assistant. Answer any question clearly and professionally."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    const answer = completion.choices[0].message.content;

    await bot.sendMessage(chatId, answer);
  } catch (error) {
    console.error(error);

    await bot.sendMessage(
      chatId,
      "Sorry, I couldn't process your request right now."
    );
  }
});

console.log("Telegram AI Bot is running...");
