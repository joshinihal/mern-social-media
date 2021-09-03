const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (request) => {
  // request = {headers}
  const authHeader = request.headers.authorization;
  if (authHeader) {
    //   Bearer ...
    const token = authHeader.split('Bearer ')[1];
    if (token){
        try {
            const user = jwt.verify(token, SECRET_KEY);
            return user;
        } catch(error){
            throw new Error('Invalid/Expired token!');
        }
    }
    throw new Error('Authentication token must be \'Bearer [token]\'! ');
  }
  throw new Error('Authorization header must be present!');
};
