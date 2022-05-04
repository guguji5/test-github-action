var shell = require('shelljs');
// shell.config.silent = true;
// shell.config.verbose = false;
const {argv} = require('./util')
const PE = argv('pe')
const PB = argv('pb')

async function fetchPEPBData(){
    const selectCurl = `curl -g 'https://xuanguapi.eastmoney.com/Stock/JS.aspx?type=xgq&sty=xgq&token=eastmoney&c=\[gzzb02(5|${PB})\]\[gzzb01(5|${PE})\]&p=1&jn=fwnTuaOs&ps=4000&s=gzzb01(5|20)&st=1&r=1651629836901' \
    -H 'Accept: */*' \
    -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
    -H 'Cache-Control: no-cache' \
    -H 'Connection: keep-alive' \
    -H 'Cookie: qgqp_b_id=f941f5a180d80009daccfa1cdb64dcca; st_si=47272808966457; em_hq_fls=js; emshistory=%5B%22833266%22%2C%22430198%22%2C%22688569%22%2C%22688199%22%2C%22605069%22%2C%22605%22%2C%22300692%22%2C%22834682%22%5D; HAList=a-sh-600519-%u8D35%u5DDE%u8305%u53F0%2Ca-sz-300059-%u4E1C%u65B9%u8D22%u5BCC%2Ca-sz-300692-%u4E2D%u73AF%u73AF%u4FDD%2Ca-sh-605069-%u6B63%u548C%u751F%u6001%2Cty-0-834682-%25u; st_asi=delete; st_pvi=26184017241557; st_sp=2022-05-01%2012%3A18%3A28; st_inirUrl=https%3A%2F%2Fwww.baidu.com%2Flink; st_sn=151; st_psi=20220504091308675-113301310291-5473420763' \
    -H 'Pragma: no-cache' \
    -H 'Referer: https://data.eastmoney.com/' \
    -H 'Sec-Fetch-Dest: script' \
    -H 'Sec-Fetch-Mode: no-cors' \
    -H 'Sec-Fetch-Site: same-site' \
    -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36' \
    -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    --compressed`
  
    const output= shell.exec(selectCurl).stdout
    return JSON.parse(output.slice(13))
}

console.log(fetchPEPBData(PE, PB))

 
