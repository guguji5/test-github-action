const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const { run } = require('./matchInDB')
const { send } = require('./sendDingMessage')
const { trigger } = require('./triggerJenkins')
var crypto = require('crypto')
var secret = process.env.Token
var pwd = process.env.Pwd
var algorithm = 'sha256'

app.use(bodyParser())

app.use(async (ctx, next) => {
	hmac = crypto.createHmac(algorithm, secret)
	hmac.write(JSON.stringify(ctx.request.body)) // write in to the stream
	hmac.end() // can't read from the stream until you call end()
	hash = hmac.read().toString('hex') // read out hmac digest
	const {
		holderReduce = 0,
		liquidStockReduceRatio = 0,
		tenthLiquidStockRatio = 0,
		numOfholderType = 1,
		eps = 0,
		PE = 100,
		PB = 100,
		Price = 1000,
	} = ctx.request.query
	if (ctx.request.path === '/') {
		const codes = await run({
			holderReduce,
			liquidStockReduceRatio,
			tenthLiquidStockRatio,
			numOfholderType,
			eps,
			PE,
			PB,
			Price,
		})
		ctx.body = codes
		await next()
	} else if (ctx.request.path === '/rebot/send' && ctx.request.header['x-hub-signature-256'] === 'sha256=' + hash) {
		if (ctx.request.body.workflow_run && ['requested', 'completed'].includes(ctx.request.body.action)) {
			await send(ctx.request.body)
		}
		ctx.body = 'success'
	} else if (ctx.request.path === '/trigger' && ctx.request.querystring.endsWith('.zip')) {
		const query = ctx.request.query
		trigger(query.target, query.zipstr, pwd)
		ctx.body = 'success'
	} else {
		ctx.body = 'damon'
	}
	await next()
})

app.listen(3002)
