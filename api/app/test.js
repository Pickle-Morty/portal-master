const express = require('express');
const multer = require('multer');
const config = require('../config');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');


module.exports = router;