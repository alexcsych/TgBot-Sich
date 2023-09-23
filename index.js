const { Telegraf } = require('telegraf')
require('dotenv').config()

const { BOT_TOKEN } = process.env
const bot = new Telegraf(BOT_TOKEN)

const api = 'https://russianwarship.rip/api/v2/statistics/latest'

let dataFromServer = {}
const getDataFromServer = forceFetch => {
  if (forceFetch) {
    console.log('Go to server')
    return fetch(api)
      .then(response => response.json())
      .then(data => {
        dataFromServer = { ...data.data.increase }
      })
  }
  console.log('Return')
}

bot.start(ctx => {
  ctx.replyWithHTML('Welcome to my bot')
})

bot.hears(/^Hi$/i, ctx => {
  ctx.reply('Hi to you too')
})

bot.hears(/[A-Z]+/i, async ctx => {
  const key = ctx.message.text
  let forceFetch = Object.keys(dataFromServer).length === 0
  console.log('forceFetch :>> ', forceFetch)
  await getDataFromServer(forceFetch)
  console.log(dataFromServer)
  ctx.reply(
    dataFromServer[key] === undefined
      ? 'Incorrect data'
      : `Amount of anihilated ${key}: ${dataFromServer[key]}`
  )
})

bot.launch()
