var shell = require('shelljs')

module.exports = {
	trigger: async (target, zipVersion, pwd) => {
		console.log('pwd', pwd)
		const cmdMap = {
			srm: `curl 'http://10.206.16.3:8090/job/build_fc-frontend_from_github_action/buildWithParameters?token=fc-frontend&zip=${zipVersion}' --user admin:${pwd}`,
			saas: `curl 'http://10.206.16.3:8090/job/build_fc-saas-web_from_github_action/buildWithParameters?token=fc-frontend&zip=${zipVersion}' --user admin:${pwd}`,
			'saas-mobile': `curl 'http://10.206.16.3:8090/job/build_fc-saas-mobile_from_github_action/buildWithParameters?token=fc-frontend&zip=${zipVersion}' --user admin:${pwd}`,
			'saas-cy-pre': 'cd /home/work/fc-foundation-app/ && npm run cy:run:pre',
			'saas-cy-prod': 'cd /home/work/fc-foundation-app/ && npm run cy:run:prod',
		}

		shell.exec(cmdMap[target])
	},
}
