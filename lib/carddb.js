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
            INSERT INTO cards 
            (card_name, annual_fee, monthly_spending_requirement, card_type, benefit) 
            VALUES (?, ?, ?, ?, ?)`;
        const values = [
            data.card_name,
            data.annual_fee,
            data.monthly_spending_requirement,
            data.card_type,
            data.benefit
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
