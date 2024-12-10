const mysql = require('mysql');

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'carddb',
});

// 데이터 저장 함수
async function saveToDatabase(cardData) {
    return new Promise((resolve, reject) => {
        const {
            card_id,
            card_name,
            annual_fee,
            required_usage,
            card_type,
            benefits,
            image_url,
        } = cardData;

        // 카드 데이터 삽입
        const cardQuery = `
            INSERT INTO cards_with_benefits
            (card_id, card_name, annual_fee, monthly_spending_requirement, card_type, 혜택1, 혜택2, 혜택3, 혜택4, 혜택5, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const benefitValues = [...benefits, ...Array(5 - benefits.length).fill(null)];
        connection.query(
            cardQuery,
            [
                card_id,
                card_name,
                annual_fee,
                required_usage,
                card_type,
                ...benefitValues,
                image_url,
            ],
            (err, result) => {
                if (err) {
                    console.error('카드 데이터 삽입 실패:', err.message);
                    return reject(err);
                }
                console.log('카드 데이터 삽입 성공:', result);
                resolve();
            }
        );
    });
}

// 데이터 조회 함수
async function getAllCards() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM cards_with_benefits';

        connection.query(query, (err, results) => {
            if (err) {
                console.error('카드 데이터 조회 실패:', err.message);
                return reject(err);
            }
            console.log('카드 데이터 조회 성공:', results);
            resolve(results);
        });
    });
}

module.exports = { saveToDatabase, getAllCards };
