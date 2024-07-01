const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/search_policy', userController.searchPolicy);
router.get('/aggregate_policies', userController.aggregatePolicies);

module.exports = router;
