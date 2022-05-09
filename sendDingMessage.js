var shell = require("shelljs");

module.exports = { send: async (body)=>{
    const {workflow_run, repository, sender, action} = body
    const cmd = `curl 'https://oapi.dingtalk.com/robot/send?access_token=23929847751c286b5448c40a855c97681a3526c94a631c1a72e1e5b1de0bf8d9' \
    -H 'Content-Type: application/json' \
    -d '{"msgtype": "text","text": {"content": "普大喜奔\n\n${action ? workflow_run.conclusion +' of ' :'}${repository.name} ${workflow_run.name} ${action} by ${sender.login}"}}'`

    shell.exec(cmd);
} };