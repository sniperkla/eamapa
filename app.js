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

const KNOWN_TEXTS = new Set([
  '📝 Open Account',
  '📥 Download',
  '💬 Contact',
  '📖 How to Use'
])

// Catch any plain text not matched by the buttons/commands
bot.on('text', async (ctx, next) => {
  const text = (ctx.message?.text || '').trim()
  // Let commands (/start, /help, etc.) and known buttons pass through
  if (text.startsWith('/')) return next()
  if (KNOWN_TEXTS.has(text)) return next()

  await ctx.reply(
    `🤖 This is an automated support bot.\n` +
      `If you want to chat with a real person, tap the button below ⬇️`,
    Markup.inlineKeyboard([
      [Markup.button.url('💬 Chat with a Human', LINKS.contact)]
    ])
  )
})

// Catch non-text messages too (stickers, photos, voice, etc.)
bot.on('message', async (ctx, next) => {
  // If the previous text handler already responded, skip; otherwise offer contact
  if (ctx.message?.text) return next()

  await ctx.reply(
    `🤖 I can’t process this type of message.\n` +
      `Tap below to chat with a real person:`,
    Markup.inlineKeyboard([
      [Markup.button.url('💬 Chat with a Human', LINKS.contact)]
    ])
  )
})

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
  // Step 1: Send the image with a short caption
  await ctx.replyWithPhoto(
    {
      source: fs.createReadStream(
        path.join(__dirname, 'public/images/howto.png') // <- put your guide image here
      )
    },
    {
      caption:
        '📌 *Instruction Guide*\nPlease also refer to the step-by-step instructions in the image above 👆',
      parse_mode: 'Markdown'
    }
  )

  // Step 2: Send the detailed instructions
  return ctx.reply(
    `📖 *How to Use EA MAPA*

1️⃣ 💳 *Open a trading account*  
   - Register with our broker partner (Vantage) with a referral code.  

2️⃣ ✅ *Verify your identity*  
   - Complete KYC to activate your MT5 CENT SWAP-FREE (STANDARD STP) account.  

3️⃣ 📩 *Account Submission*  
   ⚠️ *Important:* Once your account is approved, you * MUST * provide your MT5 account number to our support team.  
   - Tap * 💬 Contact * in the menu  
   - Or chat directly with our support agent  

4️⃣ 💻 * Download EA MAPA * and connect it with MT5  

5️⃣ ☁️ Use a * VPS * for 24/7 automated trading (recommended)  

6️⃣ 📊 Monitor your trades regularly  

⚠️ *Risk Notice:* Investment involves risks. Please study all information carefully before making decisions.`,
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
