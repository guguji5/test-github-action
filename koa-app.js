const Koa = require('koa');
const app = new Koa();
const {run } = require('./matchInDB')
app.use(async(ctx, next) => {
 const {holderReduce=0, liquidStockReduceRatio=0, tenthLiquidStockRatio=0, numOfholderType=1, eps=0, PE=100, PB=100, Price=1000}=ctx.request.query
 const codes = await run({holderReduce, liquidStockReduceRatio, tenthLiquidStockRatio, numOfholderType, eps, PE, PB, Price})
  await next();
  ctx.body = codes
});

app.listen(3000);