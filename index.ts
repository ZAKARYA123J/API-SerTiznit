import { error } from "console";
import express from "express"
const port = 3000
const app =express()
const initOptions = {/* options as documented below */};
import pgPromise from "pg-promise"
const pgp = pgPromise()
app.use(express.json())
// const db = pgp('postgresql://ocean_dev1:root@localhost:5432/sertiznit' as any) 
const db = pgp({ 
  host:'localhost',
  port:5432,
  database:'sertiznit',
  user:'ocean_dev1',
  password:'root'
}) 
db.connect().then(obj=>{
  console.log('connection success')
  obj.done()
}).catch((error)=>{ console.log(error)}
)
const PROFFESSIONS_VALIDES=[
  'Électricien',
  'Plombier',
  'Peintre',
  'Menuisier',
  'Technicien climatisation',
  'Maçon',
  'Serrurier',
  'Jardinier'
]
app.get('/artisans/search',async(req,res)=>{
  try{
    const {profession}=req.query
    if(!profession){
      return res.status(404).json({success:false,message:"profession not found"})
    }
    const data=await db.any(`SELECT * FROM artisans WHERE LOWER(profession)=LOWER($1) ORDER BY rating DESC`,[profession])
    res.status(200).json({success:true,message:"arisans return avec success", data:data})
  }catch(error:any){
   console.log(error.message)
   res.status(500).json({message:"server error"})
  }
})
app.post('/artisans',async(req,res)=>{
  try{
       const {nom,prenom,profession,telephone,email,adresse,rating}=req.body;
       if (!nom || !prenom || !profession || !telephone) {
      return res.status(400).json({
        success: false,
        message: 'Les champs nom, prenom, profession et telephone sont obligatoires'
      });
    }

       const query=`INSERT INTO artisans(nom,prenom,profession,telephone,email,adresse,rating) VALUES ($1,$2,$3,$4,$5,$6,$7) 
       RETURNING *`
       const nouvellArisan=await db.one(query,[
        nom,
        prenom,
        profession,
        telephone,
        email || null,
        adresse || null,
        rating || 0
       ])
       res.status(200).json({
        success:true,
        message:"artisan created success",
        data:nouvellArisan
       })
  }catch(error){
    console.log(error)
    res.status(500).json({
      success:false,
      message:"Erreur"
    })
  }
})
app.get('/artisans',async(req,res)=>{
  try{
     const query=`SELECT * FROM artisans ORDER BY nom`
      const data=await db.many(query)
       res.status(200).json({
        success:true,
        message:"artisan created success",
        data:data
       })
  }catch(error){
    console.log(error)
    res.status(500).json({
      success:false,
      message:"Erreur"
    })
  }
})
app.get('/artisans/:id',async(req,res)=>{
   try{
    const {id}=req.params
    const artisanExiste=await db.oneOrNone(`SELECT * FROM artisans where id = $1`,[id])
    res.status(200).json({
      success:true,
      data:artisanExiste
    })
   }catch(error){
      console.log(error)
      res.status(500).json({success:false,message:"Error"})
   }
})
app.put('/artisans/:id',async(req,res)=>{
  try{
    const {id}=req.params
       const {nom,prenom,profession,telephone,email,adresse,rating}=req.body;
       //COALESCE deal with null
       const update=await db.one(`UPDATE artisans SET
         nom =COALESCE($1,nom),
        prenom=COALESCE($2,prenom),
        profession=COALESCE($3,profession),
        telephone=COALESCE($4,telephone),
        email=COALESCE($5,email),
        adresse=COALESCE($6,adresse),
        rating=COALESCE($7,rating)
         WHERE id=$8 RETURNING *`,[nom,prenom,profession,telephone,email,adresse,rating,id] )
        res.json({
          success:true,
          message:"artisan update success",
          data:update
        })
  }catch(error:any){
console.log(error)
res.status(500).json({
  success:false,
  message:"Error",
  error:error.message
})
  }
})
app.delete('/artisan/:id',async(req,res)=>{
  try{
    const {id}=req.params
    const artisanDelet= await db.oneOrNone(`DELETE FROM artisans WHERE id = $1 RETURNING *`,[id])
    if(!artisanDelet){
      return res.status(404).json({message:"not found"})
    }
    res.status(200).json({
      success:true,
      message:"artisan delete success",
      data:artisanDelet
    })
  }catch(error:any){
    console.log(error.message)
        res.status(400).json({
      success:false
    })
  }
})
app.get('/stats/total',async(req,res)=>{
    try{
      //DISTINCT remove duplicate
     const state=await db.one(`SELECT COUNT(*) as total_artisans,AVG(rating) as average_rating,COUNT(DISTINCT profession) as nomber_profeesion FROM artisans`)
     const profession=await db.any(`SELECT profession ,COUNT(*) as number FROM artisans GROUP BY profession ORDER BY number DESC`);
     res.status(200).json({success:true,message:"data retrive success",data:{
      total_artisans:parseInt(state.total_artisans),
      average_rating:parseInt(state.average_rating),
      nomber_profession:parseInt(state.nomber_profeesion),
      profession:profession
     }})
    }catch(error:any){
    console.log(error.message)
    res.status(500).send({message:"error"})
    }
})
app.get('/filter/rating',async(req,res)=>{
   try{
   const {min}=req.query as any

   const query=await db.any(`SELECT * FROM artisans WHERE rating >= $1 ORDER BY rating DESC`,[parseFloat(min)])
   res.status(200).json({success:true,message:"filter sucess",data:query})
   }catch(error:any){
     console.log(error.message)
   }
})
app.listen(port,()=>{
    console.log(`server is running http://localhost:${port}`)
})