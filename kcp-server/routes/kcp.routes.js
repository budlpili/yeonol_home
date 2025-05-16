const express = require('express');
const router = express.Router();
const kcpController = require('../controllers/kcp.controller');

router.post('/verify', kcpController.verifyAuth);
router.post('/callback', kcpController.handleCallback);
router.post('/error', kcpController.handleError);

module.exports = router;
