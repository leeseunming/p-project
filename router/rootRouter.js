const express = require('express');
const router = express.Router();
const root = require('../lib/root'); // root 모듈 불러오기

// 메인 페이지 처리
router.get('/', (req, res) => {
    root.home(req, res); // 메인 페이지 처리
});

module.exports = router;