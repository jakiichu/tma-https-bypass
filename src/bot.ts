import 'dotenv/config';
import { Bot } from "grammy";


const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error('BOT_TOKEN not set')
}

const bot = new Bot(token);


bot.on("message", async (ctx) => {
    if(ctx.msg.text?.match(/^https?:\/\/.+/) === null){
        await ctx.reply('Неверный формат регекса: ^https?:\\/\\/.+').catch(void 0)
    }
    else {
        await ctx.reply('Переходите по URL', {reply_markup: {inline_keyboard: [[{web_app: {url: ctx.msg.text as string}, text: "URL"}]]}})
    }

});

bot.start();
