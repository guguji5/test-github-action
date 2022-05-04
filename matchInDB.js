const fs = require("fs");
const {url} = require('./webapi/db');
const { MongoClient } = require("mongodb");
// 1. 十大流通股东机构 or 基金 or 证券公司 .etc 反正不是个人 投资公司 其它 >= 5
// 2. 第10大流通股东 占比大于0.8%
// 3. 股东人数季度 减少 大于1000人
// 4. 基本每股收益(元) > 0.15
// 5. 基本每股收益(元) 同比增长
// 6. 机构持仓占流通股比例 - 其他机构持股比例 > 10%
// 7. 市盈率：小于等于20倍
// 8. 市净率：小于等于3.5倍

const client = new MongoClient(url);
async function run() {
  try {
    await client.connect();
    const database = client.db("stock");
    const holder = database.collection("holder");
    const query = { "sdltgd.9.FREE_HOLDNUM_RATIO": { $lte: 0.8 } };
    const holderList = await holder
      .find(
        { "sdltgd.9.FREE_HOLDNUM_RATIO": { $lte: 0.8 } },
        { jgcc: 1, sdltgd: 1, gdrs: 1, code: 1 }
      )
      .toArray();
      const codeList = filterBy(holderList).map(item=> item.code)
      console.log(codeList)
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

var finacialOutput = shell.exec(finacialCmd).stdout;
// 主要指标
var zzzbList = JSON.parse(finacialOutput).data;

function filterBy(list) {
  return list.filter(({gdrs,sdltgd,jgcc }) => {
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

    if (
      filterList.length >= 5 &&
      sdltgdList[9].FREE_HOLDNUM_RATIO >= 0.8 &&
      gdrsList[1].HOLDER_TOTAL_NUM - gdrsList[0].HOLDER_TOTAL_NUM >= 1000 &&
      zzzbList[0].EPSJB >= 0.15 &&
      zzzbList[0].EPSJB > zzzbList[4].EPSJB &&
      jgccDiff >= 10
    ) {

      return true
    } else {
      return false
    }
  });
}

