var shell = require("shelljs");

module.exports = { send: async (body)=>{
    const {workflow_run, repository, sender} = body
    const cmd = `curl 'https://oapi.dingtalk.com/robot/send?access_token=5587436e3116a6b60d4861a8f70399836d37a1a82623020cf2b15da57c06a228' \
    -H 'Content-Type: application/json' \
    -d '{"msgtype": "text","text": {"content": "${workflow_run.conclusion} of ${repository.name} ${workflow_run.name} triggered by ${sender.login}"}}'`

    shell.exec(cmd);
} };