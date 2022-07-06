require("appdynamics").profile({
  controllerHostName: 'tesla2022070316432516.saas.appdynamics.com',
  controllerPort: 443,
  
  // If SSL, be sure to enable the next line
  controllerSslEnabled: true,
  accountName: 'tesla2022070316432516',
  accountAccessKey: 'rsktqzh2oog5',
  applicationName: 'test',
  tierName: 'test',
  nodeName: 'process' // The controller will automatically append the node name with a unique number
 });

const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const {run } = require('./matchInDB')
const {send} = require('./sendDingMessage')
app.use(bodyParser());

app.use(async(ctx, next) => {
 console.log(ctx.request.path)
 console.log(ctx.request.body)
 const {holderReduce=0, liquidStockReduceRatio=0, tenthLiquidStockRatio=0, numOfholderType=1, eps=0, PE=100, PB=100, Price=1000}=ctx.request.query
 if(ctx.request.path ==='/'){
     const codes = await run({holderReduce, liquidStockReduceRatio, tenthLiquidStockRatio, numOfholderType, eps, PE, PB, Price})
     ctx.body = codes
 }else if(ctx.request.path ==='/rebot/send'  ){
   if(ctx.request.body.workflow_run && ['requested','completed'].includes(ctx.request.body.action)){
     await send(ctx.request.body)
   }
  ctx.body = 'success'
 } else{
    ctx.body = 'damon'
 }
  await next();
});

app.listen(3000);