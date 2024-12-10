const mysql = require('mysql');

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // MySQL 사용자 이름
    password: '1234', // MySQL 비밀번호
    database: 'carddb', // 데이터베이스 이름
});

// MySQL에 데이터 저장 함수
const saveToDatabase = (data) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO card_benefits (card_name, benefits, annual_fee) VALUES (?, ?, ?)',
            [data.cardName, data.benefits, data.annualFee],
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
