const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { ErrorResponse } = require("#dongception");

const gmail_email = process.env.GMAIL_SENDER;
const gmail_password = process.env.GMAIL_PASSWORD;
const CODE_LEN = 6;

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'stmp.gmail.com',
    port: '587',
    auth: {
        user: gmail_email,
        pass: gmail_password
    }
});

exports.sendAuthMail = async (toEmail) => {
    return new Promise((resolve, reject) => {
        const authCode = generateRandomString(CODE_LEN);

        const mailOptions = {
            from: gmail_email,
            to: toEmail,
            subject: '[no-reply] Cakaatalk 회원가입 인증 코드 안내',
            html: `<div style="margin:100px;">
                        <h1> 안녕하세요.</h1>
                        <h1> Cakaatalk 인증 요청 메일 입니다.</h1>
                        <br>
                        <p> 아래 코드를 회원가입 창으로 돌아가 입력해주세요.</p>
                        <br>

                        <div align="center" style="border:1px solid black;">
                            <h3 style="color:rgba(0,208,255,0.6)"> 회원가입 인증 코드 입니다. </h3>
                            <div style="font-size:130%">${authCode}</div>
                        </div>
                        <br/>
                    </div>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('이메일 전송 실패:', error);
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "이메일 전송 실패");
            } else {
                console.log('이메일 전송 성공:', info.response);
                resolve(authCode);
            }
        });
    });
}

exports.sendFindMail = async (toEmail) => {
    return new Promise((resolve, reject) => {
        const authCode = generateRandomString(CODE_LEN);

        const mailOptions = {
            from: gmail_email,
            to: toEmail,
            subject: '[no-reply] Cakaatalk 비밀번호 찾기 코드 안내',
            html: `<div style="margin:100px;">
                        <h1> 안녕하세요.</h1>
                        <h1> Cakaatalk 비밀번호 찾기 메일 입니다.</h1>
                        <br>
                        <p> 아래 코드를 비밀번호 찾기 창으로 돌아가 입력해주세요.</p>
                        <br>

                        <div align="center" style="border:1px solid black;">
                            <h3 style="color:rgba(0,208,255,0.6)"> 비밀번호 찾기 인증 코드 입니다. </h3>
                            <div style="font-size:130%">${authCode}</div>
                        </div>
                        <br/>
                    </div>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('이메일 전송 실패:', error);
                reject(error);
            } else {
                console.log('이메일 전송 성공:', info.response);
                resolve(authCode);
            }
        });
    });
}