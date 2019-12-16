const express=require('express');
const employeesrouter=express.Router();
const sqlite3=require('sqlite3');
//database loaded
const db=new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//param method to fetch the specefic id passed
employeesrouter.param('employeeId',(req,res,next,employeeId)=>{
    //query to select that id
    const sql='SELECT * FROM Employee WHERE Employee.id=$employeeId';
    const values={
        $employeeId:employeeId
    };
    //if error then passed to middleware chain else employee found is attached to req.employee
    db.get(sql,values,(err,employee)=>{
        if(err){
            next(err);
        }else if(employee){
            req.employee=employee;
            next();
        }else{
            res.sendStatus(404);    //if no employee with that specefic id
        }
    });
});

//will respond to get request on /api/employees/ ,return a res with all employees currently employed
//since requested on this route so req , will get a res and next to pass err to middleware
employeesrouter.get('/',(req,res,next)=>{
    //either selected employee will be selected or an error,if selected then passed on employees object
    db.all('SELECT * FROM Employee WHERE is_current_employee=1',(err,employees)=>{
        if(err){
            next(err);
        }else{
            res.status(200).json({employees:employees});
        }
    });
});

//adding new employee
employeesrouter.post('/',(req,res,next)=>{
    //all required data fetched to check if any is not missing
    const name=req.body.employee.name;
    const position=req.body.employee.position;
    const wage=req.body.employee.wage;
    const is_current_employee=req.body.employee.is_current_employee ===0 ? 0:1; //if not 1 then set to 1
    //if any required field is missing then a 400 response
    if(!name || !position || !wage){
        return res.sendStatus(400);
    }
    //if required fields present then insert it to table
    //sql query
    const sql='INSERT INTO Employee (name,position,wage,is_current_employee)VALUES($name,$position,$wage,$$isCurrentEmployee)';
    const values={
        $name:name,
        $position:position,
        $wage:wage,
        $$isCurrentEmployee:is_current_employee
    };
    //stored in db
    //if error passed to middleware chain else returned the newly added employee
    db.run(sql,values,function(err){
        if(err){
            next(err);
        }else{
            db.get(`SELECT * FROM Employee WHERE Employee.id=${this.lastID}`,(err,employee)=>{
                res.status(201).json({employee:employee});
            });
        }
    });

});

//employee on req.employee (from param request) is passed as response 
employeesrouter.get('/:employeeId',(req,res,next)=>{
    res.status(200).json({employee:req.employee});
});


module.exports=employeesrouter;