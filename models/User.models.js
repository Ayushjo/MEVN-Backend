import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,  
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  } else {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

userSchema.methods.isPasswordCorrect = async(enteredPassword)=>{
  return await bcrypt.compare(enteredPassword,this.password)
}



export const User = mongoose.model("User",userSchema)