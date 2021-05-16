const TelegramApi = require('node-telegram-bot-api')

const token = '1644890872:AAGxcHMjptU9N0gJ7J3DFEk6BF_txMZHd0o'

const bot = new TelegramApi(token, {polling: true})

const {gameOptions, againOptions} = require('./options')

const chats = {}

const startGame = async (chatId) => {
        await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать!`)
        const  randomNumber = Math.
        floor(Math.random() * 10)
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
            return  bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c62/4a8/c624a88d-1fe3-403a-b41a-3cdb9bf05b8a/1.webp')
        }

        if(text.toLowerCase() === '/info') {
            return  bot.sendMessage(chatId, `Для общения со мной доступны такие команды:\n
        /start - начать общение со мной\n
        /info - список всех команд для общения со мной`)
        }
        if(text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId,'Я тебя не понял')
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id

        if(data === '/again') {
            startGame(chatId)
        }
        if(data+"" === chats[chatId]+"") {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            console.log(data + " | " + chats[chatId])
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()