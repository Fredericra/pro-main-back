import type { Request, Response } from "express";
import Utility from "../Utility";
import uploader from "../Cloud/Uploader.single";
import database from "../Database/sanity.client";
import type { auth } from "../Type";

const professional = async(req:Request,res:Response)=>{
    const { nom,phone,place,city,country } = req.body
    const user = req.user as auth
    const file = req.file as Express.Multer.File
    try {
        const query = "*[_type == 'pro' && nom == $nom][0]"
        const Dbquery = await database.admin.fetch(query,{nom:nom})
        if(Dbquery)
        {
            return res.json(await Utility.resParams({message:'le nom est deja existe',status:false,field:'douoble'}))
        }
        else{
            const url_name = await uploader.uploadeSigle(file.buffer,'web')
            const pro = await database.admin.create({
                _type:'pro',
                userId:{
                    _type:'reference',
                    _ref:user.id
                },
                nom:nom,
                phone:phone,
                place:place,
                city:city,
                country:country,
                web:'',
                fb:'',
                waths:'',
                device:'',
                type:'',
                article:'',
            })
            await database.admin.create({
                _type:'ImgPro',
                proId:{
                    _type:"reference",
                    _ref:pro._id
                },
                link:url_name
            })
            const newQuery = "*[_type == 'pro' && userId._ref == $userId][0]{...,[_type == 'ImgPro' && proId._ref == ^._id][0]}"
            const findNewQuery = await database.admin.fetch(newQuery,{userId:user.id})
            return res.json(await Utility.resParams({message:'access',status:true,field:'activate',data:findNewQuery}))
        }
    }
     catch (error) {
    return res.json(await Utility.resParams({message:'error',status:false}))
}
}

const autPro = async(req:Request,res:Response)=>{
    const user = req.user as auth
    try {
        const query = "*[_type == 'pro' && userId._ref == $userId ][0]{...,'set':*[_type == 'ImgPro' && proId._ref == ^._id ][0]}"
        const findPro = await database.admin.fetch(query,{userId:user.id})
        if(findPro)
        {
            return res.json(await Utility.resParams({
                message:'compte pro',
                status:true,
                field:'pro',
                data:findPro
            })).status(201)
        }
         return res.json(await Utility.resParams({
                message:'compte pro',
                status:false,
                field:'pro',
                data:null
            })).status(201)
    } catch (error) {
         res.json(
        await Utility.resParams({
          message: "notfound",
          field: "error",
          status: false,
          data:null
        })
      );
    }

}

const authControlleur = { professional,autPro }

export default authControlleur;