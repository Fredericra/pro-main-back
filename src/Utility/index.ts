import { config } from "dotenv";
import { SimpleCrypto } from "simple-crypto-js";
import type { resData } from "../Type";

config();

const key = process.env.SECRET?.trim()
const crypto = new SimpleCrypto(`${key}`);


const encrypte = async(data:any):Promise<string>=>{    
    return crypto.encrypt(JSON.stringify(data));
}

const code = async(need:number):Promise<string>=>{
    const text = "AZERTYUIOPQDFGHJKLMWXCVBN0123456789";
    let random = ''
    for(let i = 0;i<need;i++){
        random += text[Math.floor(Math.random()*text.length)]
    }
    return random
}


const decrypte = async(data:any):Promise<any>=>{
    return crypto.decrypt(data);
}


const resParams = (data:resData)=>
{
    return encrypte(data);
}




const Utility =  {
    encrypte,
    decrypte,
    resParams,
    code
};

export default Utility;