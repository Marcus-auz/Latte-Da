const express=require('express');
const menurouter=express.Router();
const sqlite3=require('sqlite3');
const menuitemrouter=require('./menu-item');
const db=new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menurouter.param('menuId',(req,res,next,menuId)=>{
    const sql='SELECT * FROM Menu WHERE Menu.id=$menuId';
    const values={
        $menuId:menuId
    };
    db.run(sql,values,(err,menu)=>{
        if(err){
            next(err);
        }else if(menu){
            req.menu=menu;
            next();
        }else{
            return res.sendStatus(404);
        }
    });
});

menurouter.use('/:menuId/menu-items',menuitemrouter);

menurouter.get('/',(req,res,next)=>{
    db.get('SELECT * FROM Menu',(err,menu)=>{
        if(err){
            next(err);
        }else{
            res.status(200).json({menu:menu});
        }
    });    
});

menurouter.post('/',(req,res,next)=>{
    const title=req.body.menu.title;
    if(!title){
        return res.statusCode(400);
    }
    const sql='INSERT INTO Menu (title)VALUES($title)';
    const values={
        $title:title
    };
    db.run(sql,values,function(err){
        if(err){
            next(err);
        }else{
            db.get(`SELECT * FROM Menu WHERE Menu.id=${this.lastID}`,(err,menu)=>{
                res.status(201).json({menu:menu});
            });
        }
    });
});

menurouter.get('/menuId',(req,res,next)=>{
    res.status(200).json({menu:req.menu});
});

menurouter.put('/menuId',(req,res,next)=>{
    const title=req.body.menu.title;
    if(!title){
        return res.statusCode(400);
    }
    const sql='UPDATE Menu SET title=$title WHERE Menu.id=$menuId';
    const values={
        $title:title,
        $menuId:req.params.menu
    };
    db.run(sql,values,function(err){
        if(err){
            next(err);
        }else{
            db.get(`SELECT * FROM Menu WHERE Menu.id=${req.param.menuId}`,(err,menu)=>{
                res.status(200).json({menu:menu});
            });
        }
    });
});

menurouter.delete('/menuId',(req,res,next)=>{

})
module.exports=menurouter;