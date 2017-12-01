import express from 'express'
import Player from '../models/player'
import PlayerNormal from '../models/player_normal'
import PlayerHard from '../models/player_hard'

const router = express.Router()

router.get("/getdata",(req,res,next)=>{
    let allData = {}
    // Player.find()
    //     .exec()
    //     .then(result=>{
    //         // res.send({status:0,data:result})
    //         allData.easy = result
    //     })
    //     .catch(err=>{
    //         next(err)
    //     })

    // PlayerNormal.find()
    //     .exec()
    //     .then(result=>{
    //         allData.normal = result
    //     })
    //     .catch(err=>next(err))

    // PlayerHard.find()
    //     .exec()
    //     .then(result=>{
    //         allData.hard = result
    //     })
    //     .catch(err=>next(err))
    
    
    Promise.all([Player.find().exec(),PlayerNormal.find().exec(),PlayerHard.find().exec()])
        .then(([resultEasy,resultNormal,resultHard])=>{
            allData.easy = resultEasy
            allData.normal = resultNormal
            allData.hard = resultHard

            res.send({status:0,data:allData})
        })
    
})

router.post("/addplayer/:mode",(req,res,next)=>{
    const mode = req.params.mode
    const data = {
        name : req.body.name,
        move : req.body.move,
        time : req.body.time
    }

    let gameMode

    if(mode==="easy")
        gameMode = new Player(data);
    else if(mode==="normal")
        gameMode = new PlayerNormal(data)
    else 
        gameMode = new PlayerHard(data)

    gameMode.save()
        .then(result=>{
            if(!result) res.send({status:-1,msg:"cannot add player to board"})
            else res.send({status:0,msg:"added to ranking board"})
        })
        .catch(err=>next(err))
})

router.get("/private/deletedata/:id",(req,res,next)=>{
    const id = req.params.id
    // let dataObj = getDeletedData(id)
    // if(dataObj!=="nu"){
        // .then(data=>{
                if(id==="all"){
                    Player.remove({})
                        .then(result=>{
                            res.send({status:0,msg:"Deleted All"})
                        })
                }else{
                    Player.remove({_id:id})
                        .then(result=>{
                            res.send({status:0,msg:`${id} Deleted`})
                        })
                        .catch(err=>next(err))
                }
            // })      
    // }else{
        // dataObj
            // .then(err=>{
            //     console.log(err)
            //     res.send({status:0,msg:"No data to delete"})

            // })
    // }
})

// const getDeletedData = async id =>{
//     let temp = await new Promise((resolve,reject)=>{
//         Player.findOne({_id:id})
//         .then(result=>{
//             if(result)
//                 resolve(result)
//             else
//                 return reject("nu")
//         })
//         .catch(err=>resolve(err))
//     })
   
//     return temp
// }

export default router