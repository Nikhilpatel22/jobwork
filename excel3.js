// read excel file

var xlsx = require('xlsx')
var dataPathExcel = 'fileexcel.xlsx'
var wb = xlsx.readFile(dataPathExcel);
var sheetName = wb.SheetNames[0]
var sheetValue = wb .Sheets[sheetName];
//console.log(sheetValue);

var excelData = xlsx.utils.sheet_to_json(sheetValue);
console.log(excelData);



//read csv file

// const csv = require('csv-parser');
// const fs = require('fs');

// const result = [];
// fs.createReadStream('filecsv.csv')
// .pipe(csv({}))
// .on('data',(data)=>result.push(data))
// .on('end',()=>{
//     console.log(result);
// });