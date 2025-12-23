import cloudinary from "./Cloudinary";



const uploadeSigle = async(buffer:Buffer,folder:string):Promise<string>=>{
    return new Promise((resolve,reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            {folder},
            (error,result)=>{
                if(error) return reject(error)
                    resolve(result?.secure_url as string) 
            }
        );
        stream.end(buffer);
    })
}


const uploader = { uploadeSigle }

export default uploader;

