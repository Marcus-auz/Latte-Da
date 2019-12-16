const express=require('express');
const apirouter=require('./api/api');
const cors=require('cors');
const bodyparser=require('body-parser');
const errorhandler=require('errorhandler');

const app=express();
const PORT=process.env.PORT || 4000;

//middleware setup
app.use(bodyparser.json());
app.use(cors());
//api router mounted on all routes with /api
app.use('/api',apirouter);
//after running all routes error handler midlleware to deal with all the errors
app.use(errorhandler());
//server started 
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});

module.exports=app;