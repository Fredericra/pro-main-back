import type {  Response,Request } from 'express';



const getAll = async (req:Request,res:Response) => {
    try {
        res.status(200).json({message:"Get all route is working"});
    } catch (error) {
        res.status(500).json({message:"Internal server error",error});
    }
}



export {
    getAll
}