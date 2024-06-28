const {verifyToken} = require('../jwt/jwt');
const users = require('../database/users');

const authentication = async (req,res,next) => { 
    try {
        if(!req.headers.authorization) return res.status(400).json({message : 'Invalid Access'});

        const accessToken = req.headers.authorization.split(" ")[1];

        if(!accessToken) return res.status(400).json({message : 'Login Required'});

        const decodeToken = verifyToken(accessToken);
        const userBasedToken = await users.findOne({
            where : {
                email : decodeToken.email
            }
        })

        if(userBasedToken.email !== decodeToken.email) return res.status(404).json({message : 'Bad Request'});

        next()

    } catch (error) {
        console.log(error);
        res.status(500).json({message : 'Internal Server Error'})
    }
    
}

const authorization =  async(req,res,next) => {
    if(!req.headers.authorization) return res.status(400).json({message : 'Invalid Accesss'});

    const accessToken = req.headers.authorization.split(" ")[1];

    if(!accessToken) return res.status(404).json({message : 'Login Required'});

    const decodeToken = verifyToken(accessToken);
    const userBasedToken = await users.findOne({
        where : {
            email : decodeToken.email
        }
    })

    if(!userBasedToken) return res.status(400).json({message : 'User is not Authenticated, Login Required'});

    if(userBasedToken.role !== 'Super Admin') return res.status(400).json({message : `User ${userBasedToken.email} is not Authorized`});

    next();

}

module.exports = {authentication,authorization};