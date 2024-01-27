const Cyclic = require('cyclic');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Token bot Telegram Anda
const TELEGRAM_TOKEN = '6967036227:AAH3oUL57rVO7Z9x3x1ah1MGXzuplG3zFrg';

// Token API GPT-3 dari OpenAI
const GPT3_API_KEY = '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';

// Inisialisasi bot Telegram
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Inisialisasi Cyclic
const cyclic = new Cyclic();

// Menangani pesan yang diterima dari pengguna
bot.on('message', (msg) => {
  const user_input = msg.text;

  // Kirim permintaan ke API GPT-3
  axios.post(
    'https://api.openai.com/v1/engines/davinci-codex/completions',
    {
      prompt: user_input,
      max_tokens: 150,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GPT3_API_KEY}`,
      },
    }
  )
  .then((response) => {
    const gpt_response = response.data.choices[0].text;

    // Kirim respons dari GPT-3 ke pengguna melalui bot Telegram
    bot.sendMessage(msg.chat.id, gpt_response);
  })
  .catch((error) => {
    console.error('Error connecting to GPT-3:', error);
  });
});

// Tambahkan skrip ke Cyclic
cyclic.add(() => {
  console.log('Cyclic is running!');
});

// Jalankan Cyclic
cyclic.start();
