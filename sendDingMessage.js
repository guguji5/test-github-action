var shell = require("shelljs");
var request = require('request');

module.exports = {
    send: async (body) => {
        const { workflow_run, repository, sender, action } = body
        const genTitle = () => {
            if (workflow_run.conclusion === 'success') {
                return `普大喜奔\n\n`
            } else if (workflow_run.conclusion === 'failure') {
                return `Bad News\n\n`
            }
            return ''
        }
        const genConclusion = () => {
            return action === 'completed' ? workflow_run.conclusion + ' of ' : ''
        }
        // 三个前端
        const cmd = `curl 'https://oapi.dingtalk.com/robot/send?access_token=23929847751c286b5448c40a855c97681a3526c94a631c1a72e1e5b1de0bf8d9' \
        -H 'Content-Type: application/json' \
        -d '{"msgtype": "text","text": {"content": "${genTitle()}${genConclusion()}${repository.name} ${workflow_run.name} on ${workflow_run.head_branch} ${action} by ${sender.login}"}}'`
        if (repository.name === 'srm-fe') {
            shell.exec(cmd);
        }
        // 交付和部署
        const cmd1 = `curl 'https://oapi.dingtalk.com/robot/send?access_token=7471e65b572ba8259f0155dc08788e980d1b30f70d66ecabce530f63b68cbcf7' \
        -H 'Content-Type: application/json' \
        -d '{"msgtype": "text","text": {"content": "${genTitle()}${genConclusion()}${repository.name} ${workflow_run.name} on ${workflow_run.head_branch} ${action} by ${sender.login}"}}'`

        shell.exec(cmd1);

    }, sentryNotifyDingTalk: async (body) => {
        var options = {
          'method': 'POST',
          'url': 'https://oapi.dingtalk.com/robot/send?access_token=82d2eb5a99abb6cbc70fa1f615ecf3f22df0bdb595a45cd47cea3d31e0153b13',
          'headers': {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "msgtype": "text",
            "text": {
              "content": "demo 出了点小问题\n"+ JSON.stringify(body)
            }
          })
        
        };
        request(options, function (error, response) {
          if (error) throw new Error(error);
          console.log(response.body);
        });
        

    },
    deploy9000: async (pwd) => {
      const cmd =`curl 'http://10.206.16.3:8090/job/build_fc-frontend_9000/buildWithParameters?token=fc-frontend&srm_branch=pre&n9e_branch=main&n9e_plus_branch=pre' --user admin:${pwd}`
      shell.exec(cmd);
    }
};