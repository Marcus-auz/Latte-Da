const express=require('express');
const employeesrouter=require('./employees');
const menurouter=require('./menus');
const apirouter=express.Router();

//employees router set on /api/employees
apirouter.use('/employees',employeesrouter);
//menu router set on /api/menus
apirouter.use('/menus',menurouter);

module.exports=apirouter;