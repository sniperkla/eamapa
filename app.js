// /start command → send greeting + keyboard
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const { Telegraf, Markup } = require('telegraf')

const app = express()
const port = process.env.PORT || 5900

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// ===== CONFIG =====
const BOT_TOKEN = '8342141580:AAE75-B-3IwhRXBFPCn8TY5Sq5KTvbw1Wpo'
const path = require('path')
if (!BOT_TOKEN) throw new Error('BOT_TOKEN missing!')
const bot = new Telegraf(BOT_TOKEN)

const LINKS = {
  register: 'https://eamapa.com/register',
  website: 'https://eamapa.com',
  contact: 'https://t.me/kbottrade',
  v_mcb: 'https://zippyshare.day/Ekl62zz1UIpNztR/file',
  v_superH: 'https://zippyshare.day/rrcNCeO0f8eDS10/file'
}

// Reusable keyboards
const replyKb = {
  reply_markup: {
    keyboard: [
      ['📝 Open Account', '📥 Download'],
      ['💬 Contact', '📖 How to Use']
    ],
    resize_keyboard: true
  }
}

const quickLinksKb = Markup.inlineKeyboard([
  [
    Markup.button.url('📝 Open Account', LINKS.register),
    Markup.button.url('💬 Contact', LINKS.contact)
  ],
  [
    Markup.button.url('⬇️ MAPA.MCB V1.181N', LINKS.v_mcb),
    Markup.button.url('⬇️ MAPA SuperH V1.12N', LINKS.v_superH)
  ],
  [Markup.button.callback('📖 How to Use', 'HOW_TO_USE')]
])

const downloadKb = Markup.inlineKeyboard([
  [Markup.button.url('⬇️ MAPA.MCB V1.181N', LINKS.v_mcb)],
  [Markup.button.url('⬇️ MAPA SuperH V1.12N', LINKS.v_superH)]
])

// ===== /start =====
bot.start(async (ctx) => {
  await ctx.replyWithPhoto(
    {
      source: fs.createReadStream(
        path.join(__dirname, 'public/images/promo1.png')
      )
    },
    {
      caption: `👋 *Welcome to EA MAPA Bot*
🚀 Your free AI Trading Assistant for MT5

💡 *What you’ll get here:*
✅ Download links for EA MAPA (100% FREE)

✅ Support for MT5 trading

✅ Tips & updates on gold (XAUUSD) and forex trading

✅ Instant support & guidance

✨ Start smarter trading today — let’s get started below 👇`,
      parse_mode: 'Markdown',
      ...replyKb
    }
  )

  await ctx.reply('Quick links:', quickLinksKb)
})

// ===== Reply keyboard handlers =====
bot.hears('📝 Open Account', (ctx) =>
  ctx.reply(
    'Open the register page:',
    Markup.inlineKeyboard([
      [Markup.button.url('📝 Open Account', LINKS.register)],
      [Markup.button.url('🌍 Website', LINKS.website)]
    ])
  )
)

bot.hears('📥 Download', (ctx) =>
  ctx.replyWithPhoto(
    {
      source: fs.createReadStream(
        path.join(__dirname, 'public/images/promo1.png')
      )
    },
    {
      caption: '📥 *Choose available version below*',
      parse_mode: 'Markdown',
      ...downloadKb
    }
  )
)

bot.hears('💬 Contact', (ctx) =>
  ctx.reply(
    'Contact us here:',
    Markup.inlineKeyboard([
      [Markup.button.url('💬 Contact', LINKS.contact)],
      [Markup.button.url('🌍 Website', LINKS.website)]
    ])
  )
)

bot.hears('📖 How to Use', (ctx) => sendHowToUse(ctx))

// ===== Inline callback =====
bot.action('HOW_TO_USE', async (ctx) => {
  await ctx.answerCbQuery()
  await sendHowToUse(ctx)
})

async function sendHowToUse(ctx) {
  return ctx.reply(
    `📖 *How to Use*

1️ 💳 Open a trading account  

2️ ⏳ Wait for account verification  

3️ 💻 Download EA MAPA bot and connect with * MT5 *  

4️ ☁️ Use a * VPS * for 24/7 trading (recommended)  

5️ 📊 Monitor your trades regularly  

⚠️ Investment involves risks. Investors should study the information carefully before making any decision`,
    { parse_mode: 'Markdown' }
  )
}

// ===== Launch & graceful shutdown =====
bot.launch()
console.log('✅ Bot is running...')

app.get('/', (_req, res) => res.send('EA MAPA Bot OK'))
app.listen(port, () => console.log(`HTTP server on :${port}`))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
