const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const { send, deploy9000 } = require('./sendDingMessage')
const { trigger } = require('./triggerJenkins')
var crypto = require('crypto')
var secret = process.env.Token
var pwd = process.env.Pwd
var algorithm = 'sha256'
const cors = require('@koa/cors');
app.use(cors());
app.use(bodyParser({ enableTypes: ['text', 'json'] }))

app.use(async (ctx, next) => {
	hmac = crypto.createHmac(algorithm, secret)
	hmac.write(JSON.stringify(ctx.request.body)) // write in to the stream
	hmac.end() // can't read from the stream until you call end()
	hash = hmac.read().toString('hex') // read out hmac digest

	if (ctx.request.path === '/rebot/send' && ctx.request.header['x-hub-signature-256'] === 'sha256=' + hash) {
		const gitHubEvent  = ctx.request.header['x-github-event']
		if (gitHubEvent ==='workflow_run' &&  ctx.request.body.workflow_run && ['requested', 'completed'].includes(ctx.request.body.action)) {
			await send(ctx.request.body)
		}else if(gitHubEvent ==='push' && ctx.request.body.ref==="refs/heads/pre"){
			await deploy9000(pwd)
		}
		ctx.body = 'success'
	} else if (ctx.request.path === '/trigger' && ctx.request.querystring.endsWith('.zip')) {
		const query = ctx.request.query
		trigger(query.target, query.zipstr, pwd)
		ctx.body = 'success'
	} 
})

app.listen(3002)
