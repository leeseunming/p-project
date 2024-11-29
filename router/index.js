const express = require('express');
const router = express.Router();

// 메인 페이지
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Card Fit',
    sections: [
      { title: '20대 추천 혜택', cards: ['카드1', '카드2', '카드3', '카드4'] },
      { title: '정부 지원 혜택', cards: ['카드1', '카드2', '카드3', '카드4'] },
      { title: '퍼스널 맞춤 혜택', cards: ['카드1', '카드2', '카드3', '카드4'] },
      { title: '이달의 이벤트', cards: ['카드1', '카드2', '카드3', '카드4'] },
    ],
  });
});

module.exports = router;
