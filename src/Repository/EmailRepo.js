const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const handlebars = require('handlebars');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class EmailRepo {
    async sendEmail(templateName, subject, data, needCC = true, cc = []) {
        try {
            const template = await this.loadTemplate(templateName);
            const compiledTemplate = handlebars.compile(template);
            const html = compiledTemplate(data);

            const mailOptions = {
                from: `"My-new -Project" <${process.env.EMAIL_USER}>`,
                to: data.email,
                subject: subject,
                html: html
            };

            if (needCC && cc.length > 0) {
                mailOptions.cc = cc;
            }

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.response);
            return true;
        } catch (err) {
            console.log('Error sending email:', err);
            return false;
        }
    }

    loadTemplate(templateName) {
        return new Promise((resolve, reject) => {
            const filePath = `templates/${templateName}.handlebars`;
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    reject(new Error('Failed to load email template'));
                } else {
                    resolve(data);
                }
            });
        });
    }
}

module.exports = EmailRepo;
