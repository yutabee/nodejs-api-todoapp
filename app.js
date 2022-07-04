const express = require('express');
const app = express();
const taskRoute = require('./routes/tasks');
const connectDB = require('./db/connect');
require("dotenv").config();  //.envファイルの設定

app.use(express.json()); 
app.use(express.static('./public'));  //pubilcフォルダを読み込みにいく設定

const PORT = 3000;

//ルート設計
app.use( '/api/v1/tasks' , taskRoute );  

//データベースと接続
const start = async () => {
    try {
        await connectDB(process.env.MONGO_HEROKU_URL || process.env.MONGO_URL);
        app.listen(process.env.PORT || PORT , console.log('サーバーが起動しました'));
    } catch (err) {
        console.log(err);
    }
};

start();
