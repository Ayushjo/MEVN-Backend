import jwt from "jsonwebtoken";

const generateAccessToken = async function(userId){
  return jwt.sign(
    {
      _id: userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:'7d',
    }
  );
};

export {generateAccessToken}
