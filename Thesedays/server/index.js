const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const openai = require('openai');
const app = express();
const path = require('path');

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 모든 도메인에서의 요청을 허용하려면 '*'를 사용합니다.
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// routing check
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

app.get("/api", (req, res) => {
  res.json([
    {
      "id": 1,
      "title": "Breaking News: Earthquake Hits City 길이가 길어지면 자동으로 줄바꿈을 하는지 확인 이왕 줄바꿈 하는거 한 3줄정도는 되어야겠지? 자 이게 이제 몇자니?"
    },
    {
      "id": 2,
      "title": "Sports News: Team Wins Championship"
    },
    {
      "id": 3,
      "title": "Entertainment News: Actor Wins Award"
    }
  ]);
});

app.get('/crawl', (req, res) => {
  const process = spawn('python3', ['all.py']);
  console.log("파이썬 스크립트 실행됨");

  let articles = []; // 기사 내용을 저장할 배열

  process.stdout.on('data', (data) => {
    const result = data.toString().trim(); // 스크립트 실행 결과
    console.log(result);
    articles.push(result);
  });

  process.stderr.on('data', (data) => {
    console.error(data.toString()); // 스크립트 실행 중 발생한 오류
  });

  process.on('close', (code) => {
    if (code === 0) {
      console.log('스크립트 실행이 완료되었습니다.');
      console.log('articles:', articles); // 기사 내용 확인
      res.send('작업이 성공적으로 완료되었습니다.');
    } else {
      console.error('스크립트 실행 중 오류가 발생했습니다.');
      res.status(500).send('작업 수행 중 오류가 발생했습니다.');
    }

    // articles 변수 초기화
    articles = [];

    // 추가 작업을 수행할 수도 있습니다.
  });
});

// variable
const port = 3000;


// server start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
