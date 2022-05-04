const fs = require("fs");
var shell = require("shelljs");
const {genPrefix} = require('./index')

const { url } = require("./webapi/db");
const { MongoClient } = require("mongodb");
// 1. 十大流通股东机构 or 基金 or 证券公司 .etc 反正不是个人 投资公司 其它 >= 5 numOfholderType
// 2. 第10大流通股东 占比大于0.8% tenthLiquidStockRatio
// 3. 股东人数季度 减少 大于1000人 holderReduce
// 4. 基本每股收益(元) > 0.15 eps
// 5. 基本每股收益(元) 同比增长
// 6. 机构持仓占流通股比例 - 其他机构持股比例 > 10% liquidStockReduceRatio
// 7. 市盈率：小于等于20倍 PE
// 8. 市净率：小于等于3.5倍 PB
// 9. 价格 Price

const client = new MongoClient(url);
async function run({holderReduce, liquidStockReduceRatio, tenthLiquidStockRatio, numOfholderType, eps, PE, PB, Price}) {
  try {
    await client.connect();
    const database = client.db("stock");
    const holder = database.collection("holder");
    const holderList = await holder
      .find({code:'300068'}, { jgcc: 1, sdltgd: 1, gdrs: 1, code: 1 })
      .toArray();
      let  codeList = filterHolderBy(holderList, {holderReduce, liquidStockReduceRatio, tenthLiquidStockRatio, numOfholderType, eps}).map((item) => item.code);

    const finacial = database.collection("finacial");
    const finacialList = await finacial
      .find({ code: { $in: codeList } }, { data: 1, code: 1 })
      .toArray();

    codeList = finacialList.filter(({ data, code }) => {
      if (data[0].EPSJB >= Number(eps) && data[0].EPSJB > data[4].EPSJB) {
        return true;
      } else {
        return false;
      }
    }).map((item) => item.code);

    let result = []
    for(let i=0; i< codeList.length;i++){
      const b = await getPriceAndPE(codeList[i], {PE, PB, Price})
      b && result.push(codeList[i])
    }

    return result
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function getPriceAndPE(code, { PE, PB, Price }) {
  console.log('code', code)
  const prefix = genPrefix(code) === 'SZ' ? 0: 1
  const cmd = `curl 'http://push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f260,f261,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f127,f199,f128,f193,f196,f194,f195,f197,f80,f280,f281,f282,f284,f285,f286,f287,f292,f293,f181,f294,f295,f279,f288&secid=${prefix}.${code}&wbp2u=|0|0|0|web&cb=jQuery112403599250038852819_1651649339070&_=${new Date().getTime()}' \
  -H 'Accept: */*' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
  -H 'Cache-Control: no-cache' \
  -H 'Cookie: qgqp_b_id=f941f5a180d80009daccfa1cdb64dcca; st_si=47272808966457; em_hq_fls=js; emshistory=%5B%22%E5%B8%82%E7%9B%88%E5%B8%82%E5%87%80%22%2C%22833266%22%2C%22430198%22%2C%22688569%22%2C%22688199%22%2C%22605069%22%2C%22605%22%2C%22300692%22%2C%22834682%22%5D; st_asi=delete; HAList=a-sz-300260-%u65B0%u83B1%u5E94%u6750%2Ca-sz-300068-%u5357%u90FD%u7535%u6E90%2Ca-sz-301101-%u660E%u6708%u955C%u7247%2Ca-sh-600519-%u8D35%u5DDE%u8305%u53F0%2Ca-sz-300059-%u4E1C%u65B9%u8D22%u5BCC%2Ca-sz-300692-%u4E2D%u73AF%u73AF%u4FDD%2Ca-sh-605069-%u6B63%u548C%u751F%u6001%2Cty-0-834682-%25u; st_pvi=26184017241557; st_sp=2022-05-01%2012%3A18%3A28; st_inirUrl=https%3A%2F%2Fwww.baidu.com%2Flink; st_sn=183; st_psi=202205041522520-113200301201-1229334489' \
  -H 'Pragma: no-cache' \
  -H 'Proxy-Connection: keep-alive' \
  -H 'Referer: http://quote.eastmoney.com/' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36' \
  --compressed \
  --insecure`;
  console.log('cmd', cmd)
  const output = shell.exec(cmd).stdout;
  var PEReg = /"f162":(.*?),/;
  var PBReg = /"f167":(.*?),/;
  var PriceReg = /"f43":(.*?),/;
  const [_, pe] = output.match(PEReg);
  const [_1, pb] = output.match(PBReg);
  const [_2, price] = output.match(PriceReg);
  console.log(pe, pb);
  if (pb < Number(PB) && pe < Number(PE)) {
    return true;
  } else {
    return false;
  }
}

// async function run(){
//   let result = []
//   const codeList=['300068']
//   for(let i=0; i< codeList.length;i++){
//     const b = await getPriceAndPE(codeList[i], {PE:100, PB:100, Price:0})
//     b && result.push(codeList[i])
//   }
//   console.log(result)
// }
// run()

function filterHolderBy(list, {holderReduce, liquidStockReduceRatio, tenthLiquidStockRatio, numOfholderType, eps}) {
  console.log('holderReduce, liquidStockReduceRatio, tenthLiquidStockRatio, numOfholderType', holderReduce, liquidStockReduceRatio, tenthLiquidStockRatio, numOfholderType)
  return list.filter(({ gdrs, sdltgd, jgcc }) => {
    console.log('sdltgd', sdltgd)
    // 股东人数
    var gdrsList = gdrs;
    var filterList = sdltgd
      ? sdltgd.filter(
          (item) =>
            item.HOLDER_TYPE !== "个人" &&
            item.HOLDER_TYPE !== "投资公司" &&
            item.HOLDER_TYPE !== "其它"
        )
      : [];

    var jgccList = jgcc;
    var jgccTotal = jgccList ? jgccList[0].TOTAL_SHARES_RATIO : 0;
    var jgcc07 =
      jgccList && jgccList.find((item) => item.ORG_TYPE === "07")
        ? jgccList.find((item) => item.ORG_TYPE === "07").TOTAL_SHARES_RATIO
        : 0;
    var jgccDiff = jgccTotal - jgcc07;
    console.log('第10大流通股东 占比大于0.8%',filterList[9] ? filterList[9].FREE_HOLDNUM_RATIO : 'damon', Number(tenthLiquidStockRatio) )
    console.log('十大流通股东机构 or 基金 or 证券公司 .etc 反正不是个人 投资公司 其它 >= 5', filterList.length,  Number(numOfholderType) )
    console.log('6. 机构持仓占流通股比例 - 其他机构持股比例', jgccDiff, Number(liquidStockReduceRatio))
    console.log('股东人数季度 减少 大于1000人', gdrsList[1].HOLDER_TOTAL_NUM - gdrsList[0].HOLDER_TOTAL_NUM ,  Number(holderReduce))
    if (
      filterList.length >= Number(numOfholderType) && sdltgd[9] && 
      sdltgd[9].FREE_HOLDNUM_RATIO >= Number(tenthLiquidStockRatio) &&
      gdrsList[1].HOLDER_TOTAL_NUM - gdrsList[0].HOLDER_TOTAL_NUM >= Number(holderReduce) &&
      jgccDiff >= Number(liquidStockReduceRatio)
    ) {
      return true;
    } else {
      return false;
    }
  });
}

module.exports = {
    run
};
