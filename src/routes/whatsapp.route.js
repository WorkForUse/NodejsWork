const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

// POST: /api/whatsapp/send
router.post('/send', whatsappController.sendMessage);

// GET: /api/whatsapp/status
router.get('/status', whatsappController.getStatus);

module.exports = router;