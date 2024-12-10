const mysql = require('mysql2');

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // MySQL 사용자 이름
    password: 'root', // MySQL 비밀번호
    database: 'CardFit', // 데이터베이스 이름
});

// MySQL에 데이터 저장 함수
const saveToDatabase = (data) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO cards 
            (card_name, annual_fee, monthly_spending_requirement, card_type, benefit) 
            VALUES (?, ?, ?, ?, ?)`,
            [
                data.card_name,                     // 카드 이름
                data.annual_fee,                   // 연회비
                data.monthly_spending_requirement, // 월 사용 조건
                data.card_type,                    // 카드 유형
                data.benefit                       // 카드 혜택 (쉼표로 구분된 문자열)
            ],
            (err, results) => {
                if (err) {
                    console.error('데이터 삽입 실패:', err);
                    return reject(err);
                }
                console.log('데이터 삽입 성공:', results);
                resolve(results);
            }
        );
    });
};


// MySQL 연결 종료 함수
process.on('exit', () => {
    connection.end(() => {
        console.log('MySQL 연결 종료');
    });
});

module.exports = saveToDatabase;
