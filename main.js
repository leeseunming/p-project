const express = require('express');
const path = require('path');
const app = express();

// 라우터 불러오기
const indexRouter = require('./router/index');

// 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 연결
app.use('/', indexRouter);

// 서버 실행
app.listen(3000, () => console.log('Example app listening on port 3000'));
