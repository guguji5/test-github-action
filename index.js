var shell = require('shelljs');
const fs = require('fs')
require("appdynamics").profile({
    controllerHostName: 'tesla2022070316432516.saas.appdynamics.com',
    controllerPort: 443,
    
    // If SSL, be sure to enable the next line
    controllerSslEnabled: true,
    accountName: 'tesla2022070316432516',
    accountAccessKey: 'rsktqzh2oog5',
    applicationName: 'test',
    tierName: 'test',
    nodeName: 'process' // The controller will automatically append the node name with a unique number
   });

// const shStockTxt = fs.readFileSync(`./5.4.txt`, 'utf8');
// const shStockList = JSON.parse(shStockTxt).Results.map(item=> item.split(',')[1])
const shStockTxt = fs.readFileSync(`./sh.txt`, 'utf8');
const shStockList = JSON.parse(shStockTxt).Results.map(item=> item.split(',')[1])

const szStockTxt = fs.readFileSync(`./sz.txt`, 'utf8');
const szStockList = JSON.parse(szStockTxt).Results.map(item=> item.split(',')[1])

const cybStockTxt = fs.readFileSync(`./cyb.txt`, 'utf8');
const cybStockList = JSON.parse(cybStockTxt).Results.map(item=> item.split(',')[1])


// shell.config.silent = true;
// shell.config.verbose = false;

const stockList = Array.from(new Set([...shStockList, ...szStockList, ...cybStockList]))
// const stockList = Array.from(new Set([...shStockList])).slice(1000, 2000)
function genPrefix(str){
    if(['600','601','603', '605', '688'].includes(str.slice(0,3))){
        return 'SH'
    }
    if(['00','30'].includes(str.slice(0,2))){
        return 'SZ'
    }
   console.log(str,'not found prefix')
   return 
}
// for(var i=0;i< stockList.length;i++){
//     var prefix = genPrefix(stockList[i].trim())
//     console.log(i)
//     prefix && shell.exec(`node matchHolders.js --code=${prefix}${stockList[i].trim()}`)
// }

module.exports = {
    genPrefix
};
