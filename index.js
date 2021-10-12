const TelegramApi = require('node-telegram-bot-api')

const token = '1644890872:AAGxcHMjptU9N0gJ7J3DFEk6BF_txMZHd0o'

const bot = new TelegramApi(token, {polling: true})

const {gameOptions, againOptions} = require('./options')

const stickersHello = [
    "https://tlgrm.ru/_/stickers/076/1ba/0761ba7d-566f-4e46-ab05-367a1747f16b/1.webp", // Ями-тян ч.2
    "https://tlgrm.ru/_/stickers/379/9b9/3799b968-4bcd-3486-aac2-000bbbd13248/1.webp", // путин-привет
    "https://tlgrm.ru/_/stickers/ed2/06b/ed206b2c-6599-44f3-ae2a-94010e132505/1.webp", // Эмми
    "https://tlgrm.ru/_/stickers/944/696/9446968f-a27b-4103-a9ee-6e71c093319f/1.webp", // pink haired boy
    "https://tlgrm.ru/_/stickers/88e/586/88e586f0-4299-313f-bedb-ef45c7710422/1.webp" // Авокадик
]
const stickersBadMood = [
    "https://tlgrm.ru/_/stickers/2e4/c45/2e4c45a5-d93f-42d9-a0d6-027449c580c0/192/27.webp", // Мей
    "https://tlgrm.ru/_/stickers/88e/586/88e586f0-4299-313f-bedb-ef45c7710422/6.webp", // Авокадик
    "https://tlgrm.ru/_/stickers/742/cb9/742cb955-33c0-4e5e-9497-9c798aae0058/2.webp" // Мини Нэко
]
const stickersGoodMood = [
    "https://tlgrm.ru/_/stickers/742/cb9/742cb955-33c0-4e5e-9497-9c798aae0058/9.webp", // Мини Нэко
    "https://tlgrm.ru/_/stickers/742/cb9/742cb955-33c0-4e5e-9497-9c798aae0058/1.webp", // Мини Нэко
    "https://tlgrm.ru/_/stickers/076/1ba/0761ba7d-566f-4e46-ab05-367a1747f16b/3.webp", // Ями-тян ч.2
    "https://tlgrm.ru/_/stickers/076/1ba/0761ba7d-566f-4e46-ab05-367a1747f16b/192/23.webp" // Ями-тян ч.2
]
const chats = {}

const startGame = async (chatId) => {
        await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать!`)
        const  randomNumber = Math.floor(Math.random() * 10)
        chats[chatId] = randomNumber
        await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}



const start = () => {
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        bot.setMyCommands([
            {command: '/start', description: 'Начать общение со мной'},
            {command: '/info', description: 'Список всех команд для общения со мной'},
            {command: '/game', description: 'Сыграть в игру "Угадай цифру"'}


        ])

        if(text.toLowerCase() === '/start') {
            await bot.sendMessage(chatId, `Приветствую тебя ${msg.from.first_name}!`)
            return  bot.sendSticker(chatId,  stickersHello[Math.floor(Math.random() * stickersHello.length)])
        }

        if(text.toLowerCase() === '/info') {
            return  bot.sendMessage(chatId, `Для общения со мной доступны такие команды:\n
        /start - начать общение со мной\n
        /info - список всех команд для общения со мной\n
        /game - Сыграть в игру "Угадай цифру"`)
        }
        if(text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId,'Я тебя не понял, /info - список команд')
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id

        if(data === '/again') {
            startGame(chatId)
        } else if(data+"" === chats[chatId]+"") {
            bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`)
            return bot.sendSticker(chatId, stickersGoodMood[Math.floor(Math.random() * stickersGoodMood.length)], againOptions)
        } else {
            //console.log(data + " | " + chats[chatId])
            bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`)
            return bot.sendSticker(chatId, stickersBadMood[Math.floor(Math.random() * stickersBadMood.length)], againOptions)
        }
    })
}
start()