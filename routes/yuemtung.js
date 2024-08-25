const express = require('express');
const router = express.Router();
const yuemtungController = require('../controllers/yuemtungController');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/loan',authMiddleware.auth, yuemtungController.borrow);
router.post('/repayment',authMiddleware.auth, yuemtungController.repay)
router.get('/debt',authMiddleware.auth,transactionController.transaction)
router.get('/transaction',authMiddleware.auth,transactionController.allTransaction)

module.exports = router