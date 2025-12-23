import nodemailer from 'nodemailer'
import type { mail } from '../Type'

const transporter = nodemailer.createTransport({
    service:"gmail",
    secure:false,
    auth:{
        user:process.env.BOOK_USER,
        pass:process.env.BOOK_MAIL_API
    }
})


const sendEmail =async(data:mail):Promise<void>=>{
    try {
        const info = await transporter.sendMail(data)
    } catch (error) {
        console.error(error);
    }
}


const sendCode = async(code:string,mail:string):Promise<void>=>{

    await sendEmail(
        {
        from:process.env.BOOK_USER as string,
        to:mail,
        subject:'Confirmation',
        text:'Bonjour, ',
        html:`<div>
            <p class="margin:4px">votre code de confirmation de compte est <span style="font-size:22;color:blue">${code}</span></p>
            <p>Merci de votre patiente</p>
        </div>`
      }
    )
}
const bookMail = { transporter,sendEmail,sendCode }


export default bookMail