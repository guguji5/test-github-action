var shell = require("shelljs");

module.exports = { trigger: async (zipVersion, pwd)=>{
    const cmd =  `curl 'http://10.206.16.3:8090/job/build_fc-frontend_from_github_action/buildWithParameters?token=fc-frontend&zip=${zipVersion}' --user admin:${pwd}`
    shell.exec(cmd);
} };
