module.exports = {
    home: (req, res) => {
        const context = {
            body: 'home',
            path: '/'
        };
        res.render('mainFrame', context);
    },
    
    twenty: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM cards');
            const context = {
                body: 'twenty',
                cards: rows, // 카드 데이터 전달
                path: '/twenty'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    personal: (req, res) => {
        const context = {
            body: 'personal',
            path: '/personal'
        };
        res.render('mainFrame', context);
    },

    gov: (req, res) => {
        const context = {
            body: 'gov',
            path: '/gov'
        };
        res.render('mainFrame', context);
    },

    event: (req, res) => {
        const context = {
            body: 'event',
            path: '/event'
        };
        res.render('mainFrame', context);
    }
};