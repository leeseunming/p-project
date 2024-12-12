const mysql = require('mysql2/promise');

// MySQL 연결 설정
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // MySQL 사용자 이름
    password: '1234', // MySQL 비밀번호
    database: 'carddb', // 데이터베이스 이름
});

// 데이터 삽입 함수
const saveToDatabase = async (data) => {
    try {
        const connection = await pool.getConnection();
        const query = `
            INSERT INTO gov_Check
            (card_name, annual_fee, monthly_spending_requirement, card_type, benefit, image_url, detail_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        // 특정 카드의 링크를 조건부로 설정
        let detailUrl;
        switch (data.card_name) {
            case "BC 바로클리어 플러스":
                detailUrl = "https://www.bccard.com/app/card/CreditCardMain.do";
                break;
            case "신한카드 삑":
                detailUrl = "https://www.shinhancard.com/pconts/html/main.html";
                break;
            case "삼성 id On":
                detailUrl = "https://www.samsungcard.com/personal/main/UHPPCO0101M0.jsp";
                break;
            case "청춘대로 톡톡":
                detailUrl = "https://card.kbcard.com/CMN/DVIEW/HOAMCXPRIZZC0002?czone=_GNB_KB%B1%B9%B9%CE%C4%AB%B5%E5%B7%CE%B0%ED";
                break;
            default:
                detailUrl = data.detail_url || 'https://www.hyundaicard.com/index.jsp'; // 기본 URL
        }

        const values = [
            data.card_name || null,
            data.annual_fee || null,
            data.monthly_spending_requirement || null,
            data.card_type || null,
            data.benefit || null,
            data.image_url || null,
            detailUrl
        ];

        const [results] = await connection.execute(query, values);
        connection.release();
        console.log('데이터 삽입 성공:', results);
        return results;
    } catch (err) {
        console.error('데이터 삽입 실패:', err);
        throw err;
    }
};

// 데이터 조회 함수
const queryDatabase = async (sql, params = []) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(sql, params);
        connection.release();
        return rows;
    } catch (err) {
        console.error('데이터 조회 실패:', err);
        throw err;
    }
};

module.exports = { saveToDatabase, queryDatabase };