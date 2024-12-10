const express = require('express');
const router = express.Router();
const root = require('../lib/root'); // root 모듈 불러오기

// 메인 페이지 처리
router.get('/', (req, res) => {
    root.home(req, res); // 메인 페이지 처리
});

// twenty 페이지 처리
router.get('/twenty', (req, res) => {
    root.twenty(req, res); // twenty 페이지 처리
});

router.get('/personal', (req, res) => {
    root.personal(req, res); // personal 페이지 처리
});

router.get('/event', (req, res) => {
    root.event(req, res); // personal 페이지 처리
});

router.get('/gov', (req, res) => {
    root.gov(req, res); // personal 페이지 처리
});

// 검색 처리
router.post('/search', (req, res) => {
    root.search(req, res);
});

module.exports = router;