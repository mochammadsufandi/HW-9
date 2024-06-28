const users = require('../database/users');
const bcrypt = require('bcryptjs');
const {generateToken} = require('../jwt/jwt');



class Users {
    // GET METHOD
    async getAllUsers (req,res) {
        try {
            const page = req.query.page;
            const limit = req.query.limit;
            const allUsers = await users.findAll({
                offset : (page-1)*limit,
                limit : limit
            });

            if(allUsers.length === 0) return res.status(401).json({message : 'All Users can not be found'});

            const allUsersArray = allUsers.map((users) => {
                return {
                    email : users.email,
                    role : users.role
                }
            })

            return res.status(200).json({
                message : 'Access is accepted',
                allUsersArray : allUsersArray
            });

        } catch(error) {
            console.log(error);
            res.status(500).json({message : 'Internal Server Error'});
        }  
    }

    async getUsersById (req,res) {
        try {
            const Users = await users.findOne({
                where : {id : req.params.id }
            });

            if(Users.length === 0) {
                return res.status(404).json({message : `users with id : ${req.params.id} is not found`});
            }
            const usersById = {
                id : Users.id,
                email : Users.email,
                role : Users.role
            }
            console.log(usersById)

            return res.status(200).json({
                message : 'Access is accepted',
                usersById : usersById
            });

        } catch(error) {
            console.log(error);
            res.status(500).json({message : 'Internal Server Error'});
        }
        
    }

    async getUsersByRoles (req,res) {
        try {
            const Users = await users.findAndCountAll({
                where : {role : req.params.roles },
                // offset : 1,
                // limit : 
            });

            if(Users.length === 0) {
                return res.status(404).json({message : `users with id : ${req.params.roles} is not found`});
            }
            const usersByRole = Users.rows.map((user) => {
                return {
                    email : user.email,
                    role : user.role
                }
            })
            return res.status(200).json({
                message : 'Access is Accepted',
                userCount : Users.count,
                usersByRole : usersByRole
            });

        } catch(error) {
            console.log(error);
            res.status(500).json({message : 'Internal Server Error'});
        }
    }

    // POST METHOD
    async registerUsers (req,res) {
        try {
            const {email,gender,password,role} = req.body;

            if(!email || !gender || !password || !role) {
                return res.status(400).json({message : 'Register Required!'});
            }

            const existingUser = await users.findOne({
                where : {
                    email : email
                }
            })

            if(existingUser) {
                return res.status(400).json({message : `user with email : ${email} is already used`});
            }

            const hashedpassword = await bcrypt.hash(password,10);
            const registerUser = await users.create({
                email : email,
                gender : gender,
                password : hashedpassword,
                role : role
            })

            res.status(200).json({message : `user with email : ${registerUser.email} is success to be registered`});


        } catch(error) {
            console.log(error);
            res.status(500).json({message : 'Internal Server Error'});
        }
    }

    async loginUsers (req,res) {
        try {
            const {email,password} = req.body;
            const Users = await users.findOne({
                where : {
                    email : email
                }
            });

            if(!Users) return res.status(404).json({message : `users with email : ${email} is not found`});

            const validhashedPassword = await bcrypt.compare(password,Users.password);
            const validPassword = (pass,text) => {
                if(pass === text) {
                    return true
                } return false
            }

            if(!validhashedPassword) {
                if(validPassword(password,Users.password)===false) {
                    return res.status(401).json({message : 'Invalid Password'});
                }
            }
            const token = generateToken({email : Users.email, role : Users.role});

            return res.status(200).json({
                message : 'Login Success',
                token : token
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({message : 'Internal Server Error'});
        }
    }

    // UPDATE METHOD
    async updateUsers (req,res) {
        try {
            const Users = await users.findOne({
                where : {
                    id : req.params.id
                }
            });
            const {email,gender,password,role} = req.body;
            const emailExistingCheck = Users.email;
            const userExisting = await users.findOne({
                where : {
                    email : email
                }
            })
            
            if(!Users) return res.status(404).json({message : `users with id : ${req.params.id} is not found`});

            if(userExisting) return res.status(400).json({message : 'Your Input is already used'});

            if(!email || !gender || !password || !role) {
                return res.status(400).json({message : 'Invalid Input, Update Required'});
            }

            Users.set({
                email : email,
                gender : gender,
                password : password,
                role : role
            });

            await Users.save();

            return res.status(200).json({message : `user with email ${email} is success to be updated`});

        } catch(error) {
            console.log(error);
            res.status(500).json({message : 'Internal Server Error'})
        }
    }

    // DELETE METHOD
    async deleteUsers (req,res) {
        try {
            const Users = await users.findOne({
                where : {
                    id : req.params.id
                }
            });

            if(!Users) return res.status(404).json({message : `users with id : ${req.params.id} is not found`});

            await Users.destroy();

            return res.status(200).json({message : `users with ${Users.email} is success to be deleted`});

        } catch(error) {
            console.log(error);
            res.status(500).json({message : 'Internal Server Error'});
        }
    }
}

module.exports = Users;



