var shell = require('shelljs');
const fs = require('fs')
shell.config.silent = true;
shell.config.verbose = false;
// https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program
const argv = key => {
    // Return true if the key exists and a value is defined
    if ( process.argv.includes( `--${ key }` ) ) return true;
  
    const value = process.argv.find( element => element.startsWith( `--${ key }=` ) );
  
    // Return null if the key does not exist and a value is not defined
    if ( !value ) return null;
    
    return value.replace( `--${ key }=` , '' );
}
var code = argv('code')
var detail = argv('detail')
var cmd = `curl 'https://emweb.securities.eastmoney.com/PC_HSF10/ShareholderResearch/PageAjax?code=${code}' \
-H 'Accept: */*' \
-H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
-H 'Cache-Control: no-cache' \
-H 'Connection: keep-alive' \
-H 'Cookie: qgqp_b_id=f941f5a180d80009daccfa1cdb64dcca; st_si=47272808966457; em_hq_fls=js; Hm_lvt_f5b8577eb864c9edb45975f456f5dc27=1651378784; HAList=a-sz-300059-%u4E1C%u65B9%u8D22%u5BCC%2Ca-sh-600016-%u6C11%u751F%u94F6%u884C%2Ca-sh-600079-%u4EBA%u798F%u533B%u836F; st_asi=delete; st_pvi=26184017241557; st_sp=2022-05-01%2012%3A18%3A28; st_inirUrl=https%3A%2F%2Fwww.baidu.com%2Flink; st_sn=19; st_psi=20220502152220446-113301310291-6970835639; Hm_lpvt_f5b8577eb864c9edb45975f456f5dc27=1651476168' \
-H 'Pragma: no-cache' \
-H 'Referer: https://emweb.securities.eastmoney.com/PC_HSF10/ShareholderResearch/Index?type=web&code=${code}' \
-H 'Sec-Fetch-Dest: empty' \
-H 'Sec-Fetch-Mode: cors' \
-H 'Sec-Fetch-Site: same-origin' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36' \
-H 'X-Requested-With: XMLHttpRequest' \
-H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"' \
-H 'sec-ch-ua-mobile: ?0' \
-H 'sec-ch-ua-platform: "macOS"' \
--compressed`

var finacialCmd = `curl 'https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/ZYZBAjaxNew?type=0&code=${code}' \
-H 'Accept: */*' \
-H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
-H 'Cache-Control: no-cache' \
-H 'Connection: keep-alive' \
-H 'Cookie: qgqp_b_id=f941f5a180d80009daccfa1cdb64dcca; st_si=47272808966457; em_hq_fls=js; Hm_lvt_f5b8577eb864c9edb45975f456f5dc27=1651378784; emshistory=%5B%22833266%22%2C%22430198%22%2C%22688569%22%2C%22688199%22%2C%22605069%22%2C%22605%22%2C%22300692%22%2C%22834682%22%5D; HAList=a-sz-300059-%u4E1C%u65B9%u8D22%u5BCC%2Ca-sz-300692-%u4E2D%u73AF%u73AF%u4FDD%2Ca-sh-605069-%u6B63%u548C%u751F%u6001%2Cty-0-834682-%25u; st_asi=delete; st_pvi=26184017241557; st_sp=2022-05-01%2012%3A18%3A28; st_inirUrl=https%3A%2F%2Fwww.baidu.com%2Flink; st_sn=105; st_psi=20220503101415459-113301310291-0538813168; Hm_lpvt_f5b8577eb864c9edb45975f456f5dc27=1651544065' \
-H 'Pragma: no-cache' \
-H 'Referer: https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code=${code}' \
-H 'Sec-Fetch-Dest: empty' \
-H 'Sec-Fetch-Mode: cors' \
-H 'Sec-Fetch-Site: same-origin' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36' \
-H 'X-Requested-With: XMLHttpRequest' \
-H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"' \
-H 'sec-ch-ua-mobile: ?0' \
-H 'sec-ch-ua-platform: "macOS"' \
--compressed`

var finacialOutput = shell.exec(finacialCmd).stdout
// 主要指标
var zzzbList = JSON.parse(finacialOutput).data


var output = shell.exec(cmd).stdout
// 十大流通股东
var sdltgdList = JSON.parse(output).sdltgd

// 股东人数
var gdrsList = JSON.parse(output).gdrs
var filterList = sdltgdList ? sdltgdList.filter(item=> item.HOLDER_TYPE!=='个人' && item.HOLDER_TYPE!=='投资公司'  && item.HOLDER_TYPE!=='其它') :[]


// 1. 十大流通股东机构 or 基金 or 证券公司 .etc 反正不是个人 投资公司 其它 >= 5
// 2. 第10大流通股东 占比大于0.8%
// 3. 股东人数季度 减少 大于1000人
// 4. 基本每股收益(元) > 0.15
// 5. 基本每股收益(元) 同比增长
// 6. 机构持仓占流通股比例 - 其他机构持股比例 > 10%
// 7. 市盈率：小于等于20倍
// 8. 市净率：小于等于3.5倍

var jgccList= JSON.parse(output).jgcc
var jgccTotal = jgccList ? jgccList[0].TOTAL_SHARES_RATIO :0
var jgcc07 = jgccList &&  jgccList.find(item=> item.ORG_TYPE === '07') ? jgccList.find(item=> item.ORG_TYPE === '07').TOTAL_SHARES_RATIO : 0
var jgccDiff = jgccTotal - jgcc07


if(filterList.length >=5 && sdltgdList[9].FREE_HOLDNUM_RATIO>=0.8 && gdrsList[1].HOLDER_TOTAL_NUM - gdrsList[0].HOLDER_TOTAL_NUM >=1000 && zzzbList[0].EPSJB >= 0.15 && zzzbList[0].EPSJB > zzzbList[4].EPSJB && jgccDiff >=10){
    console.log(code, filterList.length, sdltgdList[9].FREE_HOLDNUM_RATIO.toFixed(2)+'%', '2022-03-31:',gdrsList[0].HOLDER_TOTAL_NUM, '2021-12-31:',gdrsList[1].HOLDER_TOTAL_NUM )
    fs.appendFileSync('./result.txt', `${code} ${filterList.length} ${sdltgdList[9].FREE_HOLDNUM_RATIO.toFixed(2)+'%'} 2022-03-31持仓人数:${gdrsList[0].HOLDER_TOTAL_NUM} 2021-12-31持仓人数:${gdrsList[1].HOLDER_TOTAL_NUM} 22-03-31:${zzzbList[0].EPSJB} 21-03-31:${zzzbList[4].EPSJB} 机构持仓 ${jgccTotal}\n`)
    if(detail){
        console.log(sdltgdList.map(item=> item.HOLDER_TYPE +' '+ item.FREE_HOLDNUM_RATIO.toFixed(2)+'%'))
    }
}else{
    console.log(code ,'X')
}