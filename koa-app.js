const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const {run } = require('./matchInDB')
app.use(bodyParser());

app.use(async(ctx, next) => {
 console.log(ctx.request.path)
 const {holderReduce=0, liquidStockReduceRatio=0, tenthLiquidStockRatio=0, numOfholderType=1, eps=0, PE=100, PB=100, Price=1000}=ctx.request.query
 if(ctx.request.path ==='/'){
     const codes = await run({holderReduce, liquidStockReduceRatio, tenthLiquidStockRatio, numOfholderType, eps, PE, PB, Price})
     ctx.body = codes
 }else if(ctx.request.path ==='/rebot/send'  ){
  console.log(ctx.request.body)
 } else{
    ctx.body = 'damon'
 }
  await next();
});

app.listen(3000);