import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const { authorization } = req?.headers;
  if(!authorization){
    res.status(400).send("Please provide the authorization token.!")
  }
  const auth = authorization.split("Bearer ")[1];
  const verify = await jwt.verify(
    auth,
    process.env.ACCESS_TOKEN_SECRET
  );

  req.userid = verify._id;//this created another parameter in request and with help of this now we cann access the decoded id in profile controller.
  next();
};

export { verifyToken };
