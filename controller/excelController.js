const express = require('express');
const app = express();
const mime = require('mime');
const path = require('path');
const exl = require('excel4node');
const router = express.Router()

const headerColumns = ["name","email","phone"]

let array = [];

        var user = Student.find({});
        console.log(user);

        user.forEach(u=>{
            const data = {
                name : u.name,
                email : u.email,
                phone : u.phone
            }
            array.push(data);
        })
// const data = [
//     {
//         name : "nikhil", email: "nikhilpatel.vision@gmail.com",phone : "9090909090"
//     }
// ]
const createExcelfile = () => {
    const wb = new exl.Workbook();
    const ws = wb.addWorksheet("studentlist");
    let colIndex = 1;
    headerColumns.forEach((item)=>{
        ws.cell(1,colIndex++).string(item);
    })
    let rowIndex = 2;
    user.forEach((item)=>{
        let columnIndex = 1;
        Object.keys(item).forEach((colName)=>{
            ws.cell(rowIndex,columnIndex++).string(item[colName])
        })
        rowIndex++;
    })
    wb.write("studentlist.xlsx")

}
router.get("/studentlist", (req, res, next) => {
  createExcelfile()
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