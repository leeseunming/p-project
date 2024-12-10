//root.js
const db = require('./carddb');
const { getAllCards } = require('./carddb'); // getAllCards 함수 임포트


module.exports = {
    home: (req, res) => {
        // Context 데이터 구성
        const context = {
            body: 'home' // home 템플릿을 사용하도록 설정
        };

        // mainFrame EJS 템플릿 렌더링
        res.render('mainFrame', context, (err, html) => {
            if (err) {
                console.error('Template rendering error:', err);
                return res.status(500).send('페이지 렌더링 중 오류가 발생했습니다.');
            }
            res.end(html);
        });
    },
    
    twenty: async (req, res) => {
        try {
            // 데이터 조회
            const cards = await getAllCards();

            const context = {
                body: 'twenty',
                cards, // 카드 데이터를 템플릿으로 전달
            };

            // 템플릿 렌더링
            res.render('mainFrame', context, (err, html) => {
                if (err) {
                    console.error('렌더링 오류:', err);
                    return res.status(500).send('페이지 렌더링 중 오류가 발생했습니다.');
                }
                res.end(html);
            });
        } catch (error) {
            console.error('DB 조회 오류:', error);
            res.status(500).send('DB 조회 중 오류가 발생했습니다.');
        }
    },
    
    personal: (req, res) => {
        const context = {
            body: 'personal'
        };
        res.render('mainFrame', context);
    },

    gov: (req, res) => {
        const context = {
            body: 'gov'
        };
        res.render('mainFrame', context);
    },

    event: (req, res) => {
        const context = {
            body: 'event'
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