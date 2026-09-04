const { Telegraf } = require('telegraf');
const fs = require('fs');

// ==========================================
// PENGATURAN BROADCAST
// ==========================================
const BOT_TOKEN = '8896978391:AAEiAwZbpVvIv-KXeIxggYcsnfzLs7YaTOs'; // Masukkan Token Bot yang sama
const USERS_FILE = 'users.json';

const bot = new Telegraf(BOT_TOKEN);

async function startBroadcast() {
    const messageText = process.argv.slice(2).join(' ');

    if (!messageText) {
        console.log('❌ Error: Masukkan teks pesan broadcast!');
        console.log('💡 Contoh cara pakai: node broadcast.js "Halo, ada server baru yang lebih cepat!"');
        process.exit(1);
    }

    if (!fs.existsSync(USERS_FILE)) {
        console.log('❌ Error: File database users.json tidak ditemukan! Belum ada user yang pakai bot.');
        process.exit(1);
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    if (users.length === 0) {
        console.log('⚠️ Belum ada user terdaftar di dalam database.');
        process.exit(0);
    }

    console.log(`📢 Memulai pengiriman broadcast ke ${users.length} pengguna...`);

    let successCount = 0;
    let failCount = 0;

    for (const userId of users) {
        try {
            await bot.telegram.sendMessage(userId, `📢 **PENGUMUMAN ADMIN**\n\n${messageText}`, { parse_mode: 'Markdown' });
            successCount++;
            // Jeda 50ms agar aman dari limit spam Telegram
            await new Promise(resolve => setTimeout(resolve, 50));
        } catch (e) {
            failCount++;
        }
    }

    console.log('========================================');
    console.log('✅ BROADCAST SELESAI!');
    console.log(`- Berhasil terkirim: ${successCount}`);
    console.log(`- Gagal / Block bot: ${failCount}`);
    console.log('========================================');
    process.exit(0);
}

startBroadcast();
