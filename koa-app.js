const Koa = require('koa');
const app = new Koa();
const {run } = require('./matchInDB')
app.use(async(ctx, next) => {
 const {holderReduce=0, liquidStockReduceRatio=0, tenthLiquidStockRatio=0, numOfholderType=0, eps=0}=ctx.request.query
 const codes = await run({holderReduce, liquidStockReduceRatio, tenthLiquidStockRatio, numOfholderType, eps})
  await next();
  ctx.body = codes
});

app.listen(3000);