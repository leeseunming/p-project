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

    personal: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM personal_Credit');
            const context = {
                body: 'personal',
                cards: rows, // 카드 데이터 전달
                path: '/personal'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    personalCheck: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM personal_Check');
            const context = {
                body: 'personal',
                cards: rows, // 카드 데이터 전달
                path: '/personal'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    gov: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM gov_Credit');
            const context = {
                body: 'gov',
                cards: rows, // 카드 데이터 전달
                path: '/gov'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    govCheck: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM gov_Check');
            const context = {
                body: 'gov',
                cards: rows, // 카드 데이터 전달
                path: '/gov'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    event: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM event_Credit');
            const context = {
                body: 'event',
                cards: rows, // 카드 데이터 전달
                path: '/event'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },



    search_twenty: async (req, res) => {
        try {
            const searchKeyword = req.body.search || '';
            console.log('검색어:', searchKeyword);

            if (!searchKeyword.trim()) {
                return root.twenty(req, res);
            }

            const sql = `
                SELECT * FROM twenty_credit 
                WHERE card_name LIKE ? 
                OR annual_fee LIKE ? 
                OR monthly_spending_requirement LIKE ?
                OR benefit LIKE ?
                UNION
                SELECT * FROM twenty_check 
                WHERE card_name LIKE ? 
                OR annual_fee LIKE ? 
                OR monthly_spending_requirement LIKE ?
                OR benefit LIKE ?
            `;

            const likeKeyword = `%${searchKeyword}%`;
            // 8개의 매개변수 전달 (UNION으로 인해 각 테이블당 4개씩)
            const params = [
                likeKeyword, likeKeyword, likeKeyword, likeKeyword,  // twenty_credit 테이블용
                likeKeyword, likeKeyword, likeKeyword, likeKeyword   // twenty_check 테이블용
            ];

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
                searchKeyword: req.body.search || '',  // searchKeyword를 req.body.search로 수정
                error: '검색 중 오류가 발생했습니다.',
                cards: []  // 빈 배열 전달
            };
            res.render('mainFrame', context);
        }
    }
};