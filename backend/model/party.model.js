import pool from "../database/db.js";
export default class Party{
    constructor({id,name,phone_number,email,GSTIN,type,billing_address,shipping_address,to_collect,to_pay,userID}){
        this.id=id?id:null;
        this.name=name?name:null;
        this.phone_number=phone_number?phone_number:null;
        this.email=email?email:null;
        this.GSTIN=GSTIN?GSTIN:null;
        this.type=type?type:null;
        this.billing_address=billing_address?billing_address:null;
        this.shipping_address=shipping_address?shipping_address:null;
        this.to_collect=to_collect?to_collect:null;
        this.to_pay=to_pay?to_pay:null;
        this.userID=userID?userID:null;
    }

    async save(){
        const sql="INSERT INTO parties(name,phone_number,email,GSTIN,type,billing_address,shipping_address,to_collect,to_pay,userID) VALUES (?,?,?,?,?,?,?,?,?,?);"
        const [result]=await pool.execute(sql,[this.name,this.phone_number,this.email,this.GSTIN,this.type,this.billing_address,this.shipping_address,this.to_collect,this.to_pay,this.userID]);
        return result;
    }

    static async allParty(userID){
        const sql="SELECT users.id AS usersID,parties.id AS partiesID ,users.* ,parties.* FROM users JOIN parties ON users.id=?"
        const result=await pool.execute(sql,[userID]);
        return result[0];
    }
}
