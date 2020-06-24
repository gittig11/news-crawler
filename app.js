const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
const views = require('koa-views');
const utils = require('./utils/util');
const timeJob = require('./utils/timeJob');
const CrawlerCtr = require('./controllers/crawler');

const app = new Koa();

const crawler = new CrawlerCtr();

// 静态文件
app.use(static(
  path.join( __dirname,  './static')
))

// 加载模板引擎
app.use(views(
  path.join(__dirname, './views'), {
    extension: 'ejs'
  }
))

app.use(async ctx => {
  const newsList = await utils.readJsonFile();
  const list = JSON.parse(newsList);
  await ctx.render('index', {
    list: list.data,
    time: utils.getNowDate()
  })
});


app.listen(4000, () => {
  console.log('开始监听')
  timeJob(function() {
    crawler.cnNews()
  })
});