const express=require('express');
const employeesrouter=express.Router();
const sqlite3=require('sqlite3');
const db=new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//will respond to get request on /api/employees/ ,return a res with all employees currently employed
employeesrouter.get('/',(req,res,next)=>{
    db.all('SELECT * FROM Employee WHERE is_current_employee=1',(err,employees)=>{
        if(err){
            next(err);
        }else{
            res.status(200).json({employees:employees});
        }
    });
});

module.exports=employeesrouter;