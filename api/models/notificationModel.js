import mongoose from "mongoose";

const notificatuionSchema = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        required: true,
        enum:['follow','like']
    },
    read:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


const Notification = mongoose.model("Notification",notificatuionSchema)
export default Notification