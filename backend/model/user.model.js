import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import pool from "../database/db.js"
class User{
    constructor({id,username,email,password,refreshToken,created,otp}){
        this.id=id
        this.username=username,
        this.email=email,
        this.password=password,
        this.refreshToken=refreshToken,
        this.otp=otp;
    }


    async save(){
        this.password=await bcrypt.hash(this.password,10)
        const sql="INSERT INTO users(username,email,password) values(?,?,?);"
        const [result]=await pool.execute(sql,[this.username,this.email,this.password]);
        return result;
    }

    async checkPassword(password){
        const isCorrect=await bcrypt.compare(password,this.password);
        return isCorrect;
    }

    static async findById(id){
        const sql="SELECT * FROM users WHERE id=?;"
        const [result]=await pool.execute(sql,[id]);
        return new User(result[0]);
    }

    static async find(){
        const sql="SELECT * FROM users;"
        const [result]=await pool.execute(sql);
        return result;
    }

    async generateAccessToken(){
        return  jwt.sign(
            {
                id:this.id,
                username:this.username,
                email:this.email
            },
            process.env.ACCESS_TOKEN_SECRECT,
            {
                expiresIn:'24h'
            }
        )
    }

    async generateRefreshToken(){
        return  jwt.sign(
            {
                id:this.id,
                username:this.username,
            },
            process.env.REFRESH_TOKEN_SECRECT,
            {
                expiresIn:'10d'
            }
        )
    }
}

export default User;