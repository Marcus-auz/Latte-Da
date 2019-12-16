const express=require('express');
const employeesrouter=require('./employees');

const apirouter=express.Router();

//employees router set on /api/employees
apirouter.use('/employees',employeesrouter);

module.exports=apirouter;