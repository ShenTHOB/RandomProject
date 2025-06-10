
const nodemailer = require("nodemailer");

// class for tempporary store which maps each user and their temporary code.
class CodeStore {
    constructor() {
      this.store = new Map();
    }
  
    saveCode(email, code) {
      this.store.set(email, code);
    }
  
    getCode(email) {
      return this.store.get(email);
    }
  
    clearCode(email) {
      this.store.delete(email);
    }
  }


  // create an instance of the codeStore to store the generated code locally until the user verify.
const codeStore = new CodeStore();
  
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
  

/**
 * function generates a 6 digit code , then sends the email and saves the code in temporary storage in order to verify in the future.
 * @param {*} email 
 * @returns 
 */
async function sendCode(email) {
    if (!email || typeof email !== "string") {
      throw new Error("Invalid email.");
    }
    
    // generate and store code.
    const code = generateCode();
    codeStore.saveCode(email, code);  

    // setup sender and reciever
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "put sender gmail here",
        pass: "put generated password from gmail app",
      },
       tls: {
    rejectUnauthorized: false, // <== allows self-signed certs
  },
    });
  
    const mailOptions = {
      from: "put sender email",
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
    };
    
    // sends email
    await transporter.sendMail(mailOptions);
  
    return { message: "Code sent to email." };
}

/**
 * Function will verify code, retrieve from temporary storage, then clear code after verification.
 * @param {*} email 
 * @param {*} code 
 * @returns 
 */
function verifyCode(email, code) {
    if (!email || !code) {
      return { success: false, message: "Missing email or code" };
    }
  
    const storedCode = codeStore.getCode(email);
    if (storedCode === code) {
      codeStore.clearCode(email); // Invalidate after successful verification
      return { success: true, message: "✅ Verification approved" };
    } else {
      return { success: false, message: "❌ Invalid code" };
    }
}
  
  module.exports = { sendCode, verifyCode };
  