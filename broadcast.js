const { Telegraf } = require('telegraf');
const fs = require('fs');

// Masukkan token bot Anda di sini (pastikan sama persis dengan bot.js)
const BOT_TOKEN = '8896978391:AAEiAwZbpVvIv-KXeIxggYcsnfzLs7YaTOs'; 
const USERS_FILE = 'users.json';

const bot = new Telegraf(BOT_TOKEN);

async function startBroadcast() {
    const messageText = process.argv.slice(2).join(' ');

    if (!messageText) {
        console.log('❌ Error: Masukkan teks pesan broadcast!');
        console.log('💡 Contoh: node broadcast.js "Halo semua!"');
        process.exit(1);
    }

    if (!fs.existsSync(USERS_FILE)) {
        console.log('❌ Error: File users.json tidak ditemukan!');
        process.exit(1);
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    if (users.length === 0) {
        console.log('⚠️ Database users.json kosong.');
        process.exit(0);
    }

    console.log(`📢 Mengirim broadcast ke ${users.length} user...`);

    let successCount = 0;
    let failCount = 0;

    for (const userId of users) {
        try {
            await bot.telegram.sendMessage(userId, `📢 **PENGUMUMAN**\n\n${messageText}`, { parse_mode: 'Markdown' });
            console.log(`✅ Berhasil kirim ke: ${userId}`);
            successCount++;
            await new Promise(resolve => setTimeout(resolve, 100)); // Jeda aman
        } catch (e) {
            console.log(`❌ Gagal kirim ke ${userId} -> ${e.message}`);
            failCount++;
        }
    }

    console.log('========================================');
    console.log(`✅ SELESAI | Sukses: ${successCount} | Gagal: ${failCount}`);
    console.log('========================================');
    process.exit(0);
}

startBroadcast();
