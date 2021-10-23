const express = require('express');
const app = express();
const mime = require('mime');
const path = require('path');
const Student = require('./models/student');
const exl = require('excel4node');
const router = express.Router()

const headerColumns = ["name","email","phone"]

// let array = [];

//         var user = Student.find({});
//         console.log(user);

//         user.forEach(u=>{
//             const data = {
//                 name : u.name,
//                 email : u.email,
//                 phone : u.phone
//             }
//             array.push(data);
//         })
const data = [
    {
        name : "nikhil", email: "nikhilpatel.vision@gmail.com",phone : "9090909090"
    },
    {
        name : "nikhilpatel", email: "nikhil.vision@gmail.com",phone : "9090909898"
    }

]
// const data = Student.find().then((objs)=>{
//     let tutorials = [];

//     objs.forEach((obj)=>{
//         tutorials.push({
//             name:obj.name,
//               email : obj.email,
//               phone : obj.phone
//         })
//     })
// })
const createExcelfile = (req,res) => {
 
    const wb = new exl.Workbook();
    const ws = wb.addWorksheet("studentlist");
    let colIndex = 1;
    headerColumns.forEach((item)=>{
        ws.cell(1,colIndex++).string(item);
    })
    var style = wb.createStyle({
        font : {
            color: '#ff0800',
            size:12
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -'
    })
    let rowIndex = 2;
    data.forEach((item)=>{
        let columnIndex = 1;
        Object.keys(item).forEach((colName)=>{
            ws.cell(rowIndex,columnIndex++).string(item[colName]).style(style);
        })
        rowIndex++;
    })
    wb.write("studentlist.xlsx")

}
router.get("/studentlist", (req, res, next) => {
  createExcelfile()
  //const file = Math.random() + '.xlsx';
  const file = __dirname + "/studentlist.xlsx"
  const fileName = path.basename(file)
  const mimeType = mime.getType(file)
  res.setHeader("Content-Disposition", "attachment;filename=" + fileName)
  res.setHeader("Content-Type", mimeType)

  setTimeout(() => {
      res.download(file)
  }, 2000);
})
 
app.use('/', router)
app.listen(3000, () => {

})