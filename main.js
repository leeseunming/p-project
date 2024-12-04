const express = require('express');
const path = require('path');
const app = express();

// 라우터 불러오기
const indexRouter = require('./router/rootRouter');

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공
// public 디렉토리를 정적 경로로 설정
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public'))); // 추가로 public 폴더 자체도 정적 경로로 제공

// 라우터 연결
app.use('/', indexRouter);

// 404 에러 처리
app.use((req, res, next) => {
  res.status(404).send('페이지를 찾을 수 없습니다.');
});

asldasdkmasldmaslkfaslkfaslkfnaljsfnzlc

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
