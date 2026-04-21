import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        tls:{
            rejectUnauthorized: false
        }
    }
}

export const transport = nodemailer.createTransport(config());