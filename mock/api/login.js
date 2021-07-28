module.exports =  (app)=>{
    app.get('/mock',(req,res)=>{
        console.log(req.query,1232123)
    })
}