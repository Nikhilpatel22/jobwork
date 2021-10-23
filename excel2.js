const Excel = require('exceljs');

async function exTest(){
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("My Sheet");
  worksheet.getCell('A1').font = {color: {argb: "004e47cc"}};

worksheet.columns = [
 {header: 'Id', key: 'id', width: 10},
 {header: 'Name', key: 'name', width: 32}, 
 {header: 'email', key: 'email', width: 15,}
];

worksheet.autoFilter = 'A1:C1';

worksheet.mergeCells('A2:C2');
worksheet.getCell('A2').value = 'student list';
worksheet.getCell('A2').alignment = { horizontal:'center'} ;

worksheet.eachRow(function (row, rowNumber) {
    row.eachCell((cell, colNumber) => {
        if (rowNumber == 1) {
            // First set the background of header row
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'f5b914' }
            }
        }
        // Set border of each cell 
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    })
    //Commit the changed row to the stream
    row.commit();
});
worksheet.addRow({id: 1, name: 'nikhil', email: 'nikhilpatel.vision@gmail.com'}).font = {color: {argb: "004e47cc"}};
worksheet.addRow({id: 2, name: 'patel', email: 'patel@gmail.com'});
//row2.getCell(23).font = {color: {argb: "004e47cc"}}; 

// save under export.xlsx
await workbook.xlsx.writeFile('export.xlsx');

//load a copy of export.xlsx
const newWorkbook = new Excel.Workbook();
await newWorkbook.xlsx.readFile('export.xlsx');

const newworksheet = newWorkbook.getWorksheet('My Sheet');
newworksheet.columns = [
 {header: 'Id', key: 'id', width: 10},
 {header: 'Name', key: 'name', width: 32}, 
 {header: 'email', key: 'email', width: 15,}
];
await newworksheet.addRow({id: 3, name: 'patel123', email: 'patel123@gmail.com'});

await newWorkbook.xlsx.writeFile('export2.xlsx');
console.log("File is written");

};

exTest();