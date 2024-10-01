import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { text } from 'stream/consumers'
dotenv.config()

export const verificationMail = async(email:string, verificationLink:string)=>{

    const fitzeeEmail = process.env.user_email as string
    const emailSubject = "Verification for your Fitzee account"
    const content = `Hello please verify your email by clicking the link: ${verificationLink}`

    const transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: fitzeeEmail,
            pass:process.env.user_email_password as string
        }
    })

    const mailOptions = {
        from: fitzeeEmail,
        to: email,
        subject: emailSubject,
        text:content,
        html: `<p>Please verify your email by clicking the link: <a href="${verificationLink}">${verificationLink}</a></p>`
    }

     await transport.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error);
            
            return {status:500, success:false, message:'Error sending mail', error}
        }
        // console.log('mail send successfully', info);
        
    })
    return {status:200, success:true, message:'Email send successfully'}
}