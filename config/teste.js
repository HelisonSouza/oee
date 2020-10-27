const notas=require('../../models/notas');

module.exports={
    save:(req,res)=>{
        
        let newNotas=new notas({
            titulo:req.body.title,
            conteudo:req.body.content,
            usuario:req.session.user._id,
            ativo:'true',
            creation:Date()
        })

       // console.log(req.body.content)
       

        newNotas.save((err,data)=>{
            if(err){
                return res.status(500).json({
                    message:'Erro ao Salvar',
                    error:err
                })
            }
           // res.redirect('/client');

            console.log(data)
        })
    }
}


bcrypt.compare(senha,results.senha,(err,data)=>{
  if(data===true){
      req.session.user={'_id':results._id,'email':results.email};
      let login=req.session.user;
      res.render('dash/client',{login});
     //res.json(login);
  }else{
      res.redirect('/');
  }
})

// res.send('deu certo')