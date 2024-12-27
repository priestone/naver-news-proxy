// index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// 만약 .env 파일을 사용할 거라면 추가 (npm install dotenv 필요)
// require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS 허용
app.use(cors());

// 간단 테스트용 라우트 (제대로 작동하는지 확인)
app.get("/", (req, res) => {
  console.log(888);
  res.send("Hello from Render Proxy Server!");
});

// 프록시 라우트 (네이버 뉴스 API)
app.get("/api/news", async (req, res) => {
  try {
    // 클라이언트에서 ?query=코로나 같은 형태로 보낼 때 사용
    const query = req.query.query || "테스트";

    // 네이버 오픈API 호출
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/news.json",
      {
        params: {
          query,
          display: 10,
          start: 1,
          sort: "date",
        },
        headers: {
          // .env 쓰면 process.env.NAVER_CLIENT_ID 식으로 넣기
          "X-Naver-Client-Id": "gFtad_k95qlwI3QbSo7v",
          "X-Naver-Client-Secret": "UoHpSuZaDp",
        },
      }
    );

    // 응답 데이터를 그대로 전달
    // console.log(response);
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "네이버 API 호출 오류",
      detail: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log("Secret:", "UoHpSuZaDp");
