const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

class WhatsAppService {
    constructor() {
        this.client = null;
        this.isReady = false;
    }

    initialize(io) {
        this.client = new Client({
            authStrategy: new LocalAuth({ dataPath: './sessions' }), // Session yahan save hogi
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        // 1. QR Code Event
        this.client.on('qr', async (qr) => {
            console.log('New QR Generated');
            // QR string ko DataURL (Image) mein convert karke frontend ko bhejna
            const qrImage = await qrcode.toDataURL(qr);
            io.emit('qr', qrImage);
        });

        // 2. Authenticated Event
        this.client.on('authenticated', () => {
            console.log('Authenticated successfully!');
        });

        // 3. Ready Event
        this.client.on('ready', () => {
            this.isReady = true;
            console.log('WhatsApp Client is Ready!');
            io.emit('status', { connected: true, message: 'WhatsApp is Ready' });
        });

        // 4. Disconnected Event
        this.client.on('disconnected', (reason) => {
            this.isReady = false;
            console.log('Client disconnected:', reason);
            this.client.initialize(); // Auto-reconnect
        });

        this.client.initialize();
    }

    // Message bhejne ka function
    async sendMessage(number, message) {
        if (!this.isReady) throw new Error('WhatsApp is not connected');
        
        // Number format handle karna (923xxxxxxxxx)
        const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        return await this.client.sendMessage(formattedNumber, message);
    }
}

module.exports = new WhatsAppService();