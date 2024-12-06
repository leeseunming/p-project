module.exports = {
    home: (req, res) => {
        const sections = [
            {
                title: '20대 추천 혜택',
                description: '20대를 위한 추천 카드 혜택',
                cards: [
                    { name: '카드1', image: '/img/card-1.png' },
                    { name: '카드2', image: '/img/card-2.png' },
                    { name: '카드3', image: '/img/card-3.png' },
                    { name: '카드4', image: '/img/card-4.png' },
                ],
            },
            {
                title: '정부 지원 혜택',
                description: '정부에서 제공하는 지원 카드 혜택',
                cards: [
                    { name: '카드1', image: '/img/image-11.png' },
                    { name: '카드2', image: '/img/image-8.png' },
                    { name: '카드3', image: '/img/image-2.png' },
                    { name: '카드4', image: '/img/image-5.png' },
                ],
            },
        ];

        const sliderCards = [
            { image: '/img/twentycard.png' },
            { image: '/img/govcard.png' },
            { image: '/img/personcard.png' },
            { image: '/img/eventcard.png' },
        ];

        // Context 데이터 구성
        const context = {
            sections: sections,
            sliderCards: sliderCards,
        };

        // mainFrame EJS 템플릿 렌더링
        res.render('mainFrame', context, (err, html) => {
            if (err) {
                console.error('Template rendering error:', err);
                return res.status(500).send('페이지 렌더링 중 오류가 발생했습니다.');
            }
            res.end(html);
        });
    }
};