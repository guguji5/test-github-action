var shell = require('shelljs');
const fs = require('fs')

const {url} = require('./webapi/db');
const { MongoClient } = require("mongodb");

const {fetchDate} = require('./insert')

const client = new MongoClient(url);

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

const stockList = Array.from(new Set([...shStockList, ...szStockList, ...cybStockList])).slice(0,100)
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


async function run() {
  try {
    await client.connect();
    const database = client.db('stock');
    const finacialholder = database.collection('holder');
    const finacial = database.collection('finacial');

    for(var i=0;i< stockList.length;i++){
        var prefix = genPrefix(stockList[i].trim())
        console.log(i)
        if(prefix){
            const  { finacialOutput, holderOutput } = await fetchDate(`${prefix}${stockList[i].trim()}`)
            await holder.insertOne({...holderOutput, code:stockList[i].trim()})
            await holder.insertOne({...finacialOutput, code:stockList[i].trim()})
        }
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);