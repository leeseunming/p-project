const db = require('./carddb');
const { queryDatabase } = require('./carddb');


module.exports = {
    home: async (req, res) => {
        try {
            const twentyCards = await queryDatabase('SELECT card_name, image_url FROM twenty_Credit LIMIT 4');
            const govCards = await queryDatabase('SELECT card_name, image_url FROM gov_Credit LIMIT 4');
            const personalCards = await queryDatabase('SELECT card_name, image_url FROM personal_Credit LIMIT 4');
            const eventCards = await queryDatabase('SELECT card_name, image_url FROM event_Credit LIMIT 4');
    
            const context = {
                twentyCards,  // 20대 추천 카드
                govCards,     // 정부 지원 카드
                personalCards,// 퍼스널 맞춤 카드
                eventCards    // 이달의 이벤트 카드
            };
    
            res.render('mainFrame', { body: 'home', ...context });
        } catch (err) {
            console.error('데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },
    
    
    twenty: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM twenty_Credit');
            const context = {
                body: 'twenty',
                cards: rows // 카드 데이터 전달
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    twentyCheck: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM twenty_Check');
            const context = {
                body: 'twenty',
                cards: rows // 체크카드 데이터 전달
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
                cards: rows // 카드 데이터 전달
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
                cards: rows // 카드 데이터 전달
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
                cards: rows // 카드 데이터 전달
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
                cards: rows // 카드 데이터 전달
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
                cards: rows // 카드 데이터 전달
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
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