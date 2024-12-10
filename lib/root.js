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
            const rows = await queryDatabase('SELECT * FROM cards ORDER BY card_id');
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
    
    search: (req, res) => {
        const searchKeyword = req.body.search || ''; // 검색어가 없을 경우 빈 문자열
        if (!searchKeyword) {
            return res.status(400).send('검색어를 입력해주세요.');
        }

        const sql = `
            SELECT * FROM carddb 
            WHERE card_name LIKE ? 
            OR card_company LIKE ? 
            OR card_benefits LIKE ?;
        `;  // 실제 DB 구조에 맞게 수정 필요

        const likeKeyword = `%${searchKeyword}%`;

        db.query(sql, [likeKeyword, likeKeyword, likeKeyword], (err, results) => {
            if (err) {
                console.error('검색 오류:', err);
                return res.status(500).send('검색 중 오류가 발생했습니다.');
            }

            const context = {
                searchResults: results,
                body: 'twenty'  // twenty.ejs를 렌더링
            };

            res.render('mainFrame', context, (err, html) => {
                if (err) {
                    console.error('렌더링 오류:', err);
                    return res.status(500).send('페이지 렌더링 중 오류가 발생했습니다.');
                }
                res.end(html);
            });
        });
    }
};