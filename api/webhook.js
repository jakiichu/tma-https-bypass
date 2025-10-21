import 'dotenv/config';
import { Bot } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN not set');

const bot = new Bot(token);

bot.on("message", async (ctx) => {
    if (ctx.message?.text?.match(/^https?:\/\/.+/) === null) {
        await ctx.reply('Неверный формат регекса: ^https?:\\/\\/.+').catch(() => {});
    } else {
        await ctx.reply('Переходите по URL', {
            reply_markup: {
                inline_keyboard: [
                    [{ web_app: { url: ctx.message.text }, text: "URL" }]
                ]
            }
        });
    }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(200).send('OK');

    try {
        await bot.handleUpdate(req.body);
        res.status(200).send('OK');
    } catch (err) {
        console.error(err);
        res.status(500).send('error');
    }
}
