import mongoose from 'mongoose'

const Player = mongoose.Schema({
    name: {type:String},
    move: {type:String},
    time: {type:String}
})

export default mongoose.model('PlayerNormal',Player)
