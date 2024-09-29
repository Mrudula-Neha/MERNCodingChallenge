
const express = require('express');
const { initializeDatabase, getTransactions, getStatistics, getBarChartData , getPieChartData} = require('../controllers/transactionController');
const router = express.Router();


router.get('/initialize', initializeDatabase);


router.get('/', getTransactions);

router.get('/statistics', getStatistics);

router.get('/bar-chart', getBarChartData);

router.get('/pie-chart', getPieChartData);

module.exports = router;
