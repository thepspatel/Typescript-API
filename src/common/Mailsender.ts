import { info } from 'console';
import nodemailer from 'nodemailer';
import SendmailTransport from 'nodemailer/lib/sendmail-transport';

export default class Mailsender{
    private static instance:Mailsender
    private transporter: nodemailer.Transporter

    private constructor() {}
    //Create Instance for Mail
    static getInstance(){
        if(!Mailsender.instance){
            Mailsender.instance = new Mailsender();
        }
        return Mailsender.instance
    }
    //Create connection for local
    async createLocalConnection(){
        let account = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host:account.smtp.host,
            port:account.smtp.port,
            secure:account.smtp.secure,
            auth:{
                user:account.user,
                pass:account.pass
            }
        })
    }
    //Create a connection for live
    async createConnnection(){
        this.transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.DB_PORT,
            secure:process.env.TLS === 'yes'? true:false,
            auth:{
                user:process.env.SMTP_MAIL,
                password:process.env.SMTP_PASSWORD
            }
        })
    }
    //Send Mail
    async sendMail(
        requestId: string | number | string[],
        options: MailInterface
    )
    {
        return await this.transporter
        .sendMail({
            from:`"Pspatel" ${process.env.SMTP_MAIL || options.from}`,
            to:options.to,
            cc:options.cc,
            bcc:options.bcc,
            subject: options.subject,
            text:options.text,
            html:options.html
        })
        .then((info) => {
            info(`${requestId} - Mail sent successfully!!`);
            info(`${requestId} - [MailResponse]=${info.response} [MessageID]=${info.messageId}`);
            if (process.env.NODE_ENV === 'local') {
                Logging.info(`${requestId} - Nodemailer ethereal URL: ${nodemailer.getTestMessageUrl(
                    info
                )}`);
            }
            return info;
        });
    }
    //Verify Connection
    async verifyConnection(){
        return this.transporter.verify();
    }
    //Create Transporter
    getTransporter(){
        return this.transporter
    }
}