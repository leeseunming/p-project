const db = require('./carddb');
const { queryDatabase } = require('./carddb');

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
            console.log('카드 데이터 조회 시작');
            const rows = await queryDatabase('SELECT * FROM twenty_credit ORDER BY card_id');
            console.log('조회된 카드 수:', rows.length);
            console.log('조회된 카드 데이터:', rows);

            const context = {
                body: 'twenty',
                cards: rows,
                path: '/twenty'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    twentyCheck: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM twenty_Check ORDER BY card_id');
            const context = {
                body: 'twenty',
                cards: rows,
                path: '/twenty' // 체크카드 데이터 전달
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('체크카드 데이터 조회 오류:', err);
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
    },

    search_twenty: async (req, res) => {
        try {
            const searchKeyword = req.body.search || '';
            console.log('검색어:', searchKeyword);

            if (!searchKeyword.trim()) {
                return root.twenty(req, res);
            }

            const sql = `
                SELECT * FROM cards 
                WHERE card_name LIKE ? 
                OR annual_fee LIKE ? 
                OR monthly_spending_requirement LIKE ?
                OR benefit LIKE ?
            `;

            const likeKeyword = `%${searchKeyword}%`;
            // 4개의 매개변수 전달
            const params = [likeKeyword, likeKeyword, likeKeyword, likeKeyword];

            const results = await queryDatabase(sql, params);

            const context = {
                body: 'twenty',
                path: '/twenty',
                searchResults: results,
                searchKeyword: searchKeyword,
                cards: results  // 검색 결과를 cards로도 전달
            };

            res.render('mainFrame', context);

        } catch (err) {
            console.error('검색 오류:', err);
            // 에러 발생 시에도 페이지를 렌더링
            const context = {
                body: 'twenty',
                path: '/twenty',
                searchKeyword: searchKeyword,
                error: '검색 중 오류가 발생했습니다.',
                cards: []  // 빈 배열 전달
            };
            res.render('mainFrame', context);
        }
    }
};