import { Bot } from 'grammy';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN not set');

const bot = new Bot(token);

let isInited = false;
let initPromise: Promise<void> | null = null;

async function ensureBotInited() {
    if (isInited) return;

    if (!initPromise) {
        initPromise = (async () => {
            try {
                await bot.init();
                isInited = true;
                console.log('Bot initialized');
            } catch (err) {
                console.error('bot.init failed', err);
                throw err;
            } finally {
                initPromise = null;
            }
        })();
    }

    return initPromise;
}

bot.on('message', async (ctx) => {
    const text = ctx.message?.text ?? '';
    if (!/^https?:\/\/.+/.test(text)) {
        await ctx.reply('Неверный формат: ожидается URL, начинающийся с http:// или https://').catch(() => {});
        return;
    }

    await ctx.reply('Переходите по URL', {
        reply_markup: {
            inline_keyboard: [[{ web_app: { url: text }, text: 'Открыть URL' }]],
        },
    }).catch(() => {});
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') return res.status(200).send('OK');
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        await ensureBotInited();
        await bot.handleUpdate(req.body);
        return res.status(200).send('OK');
    } catch (err) {
        console.error('bot.handleUpdate error', err);
        return res.status(500).send('error');
    }
}
