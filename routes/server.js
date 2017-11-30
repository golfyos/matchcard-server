import express from 'express'
import Player from '../models/player'

const router = express.Router()

router.get("/getdata",(req,res,next)=>{
    Player.find()
        .exec()
        .then(result=>{
            res.send({status:0,data:result})
        })
        .catch(err=>{
            next(err)
        })

})

router.post("/addplayer",(req,res,next)=>{
    const data = new Player({
        name : req.body.name,
        move : req.body.move,
        time : req.body.time
    })
    data.save()
        .then(result=>{
            if(!result) res.send({status:-1,msg:"cannot add player to board"})
            else res.send({status:0,msg:"added to ranking board"})
        })
        .catch(err=>next(err))
})

router.get("/private/deletedata/:id",(req,res,next)=>{
    const id = req.params.id
    let dataObj = getDeletedData(id)
    if(dataObj!=="nu"){
        dataObj.then(data=>{
                if(id==="all"){
                    Player.remove({})
                        .then(result=>{
                            res.send({status:0,msg:"Deleted All"})
                        })
                }else{
                    Player.remove({_id:id})
                        .then(result=>{
                            res.send({status:0,msg:`${data} Deleted`})
                        })
                        .catch(err=>next(err))
                }
            })      
    }else{
        dataObj
            .then(err=>{
                console.log(err)
                res.send({status:0,msg:"No data to delete"})

            })
    }
})

const getDeletedData = async id =>{
    let temp = await new Promise((resolve,reject)=>{
        Player.findOne({_id:id})
        .then(result=>{
            if(result)
                resolve(result)
            else
                return reject("nu")
        })
        .catch(err=>resolve(err))
    })
   
    return temp
}

export default router