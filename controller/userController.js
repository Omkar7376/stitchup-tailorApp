const { Op, where, QueryTypes } = require("sequelize");
const { User } = require("../model/users/userModel")
const { validate, func } = require("joi");
const { userSchema } = require("../middleware/userValidate");
const { sequelize } = require("../config/dbConnect");
const bcrypt = require("bcrypt");
const jsonwebtoken = require('jsonwebtoken');

/* const insert = async(req,res)=> {
    //const data = User.build({username:"Omkar", email: "omkar@gmail.com"})
    //console.log(data.username);
    //await data.save()

    const data = await User.create({username:"Omkar", email: "omkar@gmail.com"})
    console.log(data.username); 
    
} */

/* const multipleUsers = async(req,res)=> {
    //const data = User.build({username:"Omkar", email: "omkar@gmail.com"})
    //console.log(data.username);
    //await data.save()

    // const users = [
    //     {
    //         username: "Kunal",
    //         email: "kunal@gmail.com"
    //     },
    //     {
    //         username: "Sahil",
    //         email: "Sahil@gmail.com"
    //     },
    //     {
    //         username: "Atharv",
    //         email: "Atharv@gmail.com"
    //     },
    // ];

    // const userDetails = await User.bulkCreate(users);
    // return res.json(multipleUsers);

    const data = await User.findAll();
    return res.json(multipleUsers)
} */

/* const test = async(req,res)=> {
    // const data = await User.findAll({
    //     where:{
    //         id:2
    //     }
    // });
    // return res.json(data)

    // const data = await User.findAll({
    //     where:{
    //         id:{
    //             // [Op.eq] : 2
    //             // [Op.in] : [2,3,40]
                
    //         },
    //         [Op.and] : [{id:3}]
    //     }
    // });
    // return res.json(data)

    //use Where clause
    // const updateUser = await User.update(
    //     {
    //         username: 'HeyOmii',
    //         email: 'omii@gmail.com'
    //     },
    //     {
    //         where:{
    //             id:5 
    //         }
    //     }
    // )
    // return res.json(updateUser)

    //Delete
    const deleteUser = await User.destroy(
        {
            where:{
                id : 3
            }
        }
    )
    return res.json(deleteUser)
}

const finderUse = async(req, res) => {
    // const data = await User.findByPk(5)
    // return res.json(data)

    //find One
    // const data = await User.findOne({
    //     where:{
    //         username: 'Omkar'
    //     }
    // })
    // return res.json(data)

    //Find or create
    const [data, created] = await User.findOrCreate({
        where:{
            id:23
        },
        defaults:{
            username: 'Swapyy',
            email: 'swapnil@gmail.com'
        }
    })
    return res.json(data, created)
} */

const createUser = async (req, res) => {
    try {
        const userData = req.body;

        const existingUser = await User.findOne({
            where: { email: userData.email }
        });

        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const { error } = userSchema.validate(userData)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const { password, ...otherUserFields } = userData;
        const hashedPass = await bcrypt.hash(password, 10)
        const user = await User.create({
            ...otherUserFields,
            password: hashedPass
        })
        return res.status(201).json({
            user: [{
                USER_ID: user.id,
                USERNAME: user.username,
                NAME: user.name,
                AGE: user.age,
                MOB_NO: user.mob_no,
                EMAIL: user.email,
                ADDRESS: user.address,
                ISACTIVE: user.isActive
            }]
        })
    } catch (e) {
        console.error(e)
        return res.status(404).json({ message: e.message })
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (!user) {
            return res.status(401).json({
                message: "Auth Failed"
            })
        } else {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result) {
                    const token = jsonwebtoken.sign({
                        email: user.email,
                        userId: user.id
                    }, process.env.SECRET, { expiresIn: '1d' }
                    )

                    return res.status(200).json({
                        code: 200,
                        message: "Auth Successful",
                        data: [{
                            token: token,
                            userData: [{
                                USER_ID: user.id,
                                USERNAME: user.username,
                                NAME: user.name,
                                EMAIL_ID: user.email,
                                MOBILE_NO: user.mob_no,
                                ADDRESS: user.address,
                                ISACTIVE: user.isActive
                            }]
                        }]
                    })
                } else {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message })
    }

}

const getUsers = async (req, res) => {
    try {
        // const users = await User.findAll()

        const users = await sequelize.query("Select * from users", {
            type: QueryTypes.SELECT
        })

        return res.status(200).json({ users })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message })
    }
}

const getUserByID = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        return res.status(200).json({ user })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        // const {error} = userSchema.validate(req.body)
        // if(error) return res.status(400).json({message : error.details[0].message})

        const user = await User.findByPk(req.params.id)
        if (!user) return res.status(500).json({ error: "user not found" })

        await user.update({
            username: req.body.username,
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            mob_no: req.body.mob_no,
            address: req.body.address,
        });
        return res.status(200).json({ msg: "User Updated" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
}

const updatePassword = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (!user) return res.status(500).json({ error: "user not found" })

        const hashedPass = await bcrypt.hash(req.body.password, 10)
        await user.update({ password: hashedPass });

        return res.status(200).json({ msg: "Password Updated" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (!user) return res.status(500).json({ error: "user not found" })

        await user.destroy();
        return res.status(200).json({ msg: "User Deleted" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    //insert, multipleUsers, test, finderUse
    createUser, login, getUsers, getUserByID, updateUser, deleteUser
}