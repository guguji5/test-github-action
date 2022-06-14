var shell = require("shelljs");

module.exports = { send: async (body)=>{
    const {workflow_run, repository, sender, action} = body
    const genTitle = ()=>{
        if(workflow_run.conclusion ==='success'){
            return `普大喜奔\n\n`
        }else if(workflow_run.conclusion ==='failure'){
            return `Bad News\n\n`
        }
        return ''
    }
    const genConclusion = ()=>{
        return action==='completed' ? workflow_run.conclusion +' of ' :''
    }
    const cmd = `curl 'https://oapi.dingtalk.com/robot/send?access_token=23929847751c286b5448c40a855c97681a3526c94a631c1a72e1e5b1de0bf8d9' \
    -H 'Content-Type: application/json' \
    -d '{"msgtype": "text","text": {"content": "${genTitle()}${genConclusion()}${repository.name} ${workflow_run.name} on ${workflow_run.head_branch} ${action} by ${sender.login}"}}'`

    shell.exec(cmd);
} };