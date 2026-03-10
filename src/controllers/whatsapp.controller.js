const whatsappService = require('../services/whatsapp.service');

// API Logic for sending message
exports.sendMessage = async (req, res, next) => {
    try {
        const { number, message } = req.body;

        if (!number || !message) {
            const error = new Error('Number and message are required');
            error.statusCode = 400;
            throw error;
        }

        const response = await whatsappService.sendMessage(number, message);
        
        res.status(200).json({
            success: true,
            data: { messageId: response.id.id }
        });
    } catch (error) {
        next(error); // Error handler ko bhej raha hai
    }
};

// API Logic for checking status
exports.getStatus = (req, res) => {
    res.status(200).json({
        success: true,
        data: { connected: whatsappService.isReady }
    });
};