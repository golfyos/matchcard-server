import express from 'express'
import Player from '../models/player'

const router = express.Router()

router.get("/getdata",(req,res)=>{
    Player.find()
        .exec()
        .then(result=>{
            res.send({status:0,data:result})
        })
        .catch(err=>{
            next(err)
        })

})

router.post("/addplayer",(req,res)=>{
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
        .catch(err=>{
            next(err)
        })
})

export default router