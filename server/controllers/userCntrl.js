const asyncHandler = require('express-async-handler');
const {User} = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {generateverificationToken,
            sendVerificationEmail, transporter} = require('../utils/email');
const {successFullVerification,gmailContent} = require('../utils/emailTemplate')

const userInfo = asyncHandler(async (req,res) => {
    res.json(req.user);
});

const registerUser = asyncHandler(async(req,res)=>{
    const {uname, email, password, phone,emergencyNo, emergencyMail, pincode} = req.body;
    console.log('Registration attempt for:', email);
    
    if(!uname || !email || !password || !phone || !emergencyNo || !emergencyMail || !pincode){
        return res.status(400).json({message: "All fields are mandatory"});
    }

    const userAvailable = await User.findOne({email: email});
    if(userAvailable){
        return res.status(400).json({message: "Email already exists"});
    }
    
    const verificationToken = generateverificationToken(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const user = await User.create({
            uname,
            email,
            password: hashedPassword,
            verificationToken,
            phoneNo: phone,
            emergencyMail,
            emergencyNo,
            pinCode: pincode
        });

        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail registration if email fails
        }
        res.status(201).json({message: "User registered successfully"});
        
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({message: `${field} already exists`});
        }
        res.status(500).json({message: "Registration failed"});
    }
});

const verifyemail = async (req, res) => {
    try {
        const tokenId = req.params.tokenId;
        const user = await User.findOne({ verificationToken: tokenId });

        if (!user) {
            return res.status(404).json({ error: 'Invalid verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        const congratulationContent = successFullVerification();

        res.status(200).send(congratulationContent);

    } catch (error) {
        res.status(500).json({ error: 'An error occurred during email verification.' });
        console.log(error);
    }
};

const loginUser  = asyncHandler(async (req,res) => {
    const {email, password, phoneNo} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({email: email});
    
    if(!user){


        res.status(404);
        throw new Error(`User with this ${email} does not exist`);
    }
    if (!user.isVerified) { user.isVerified = true; await user.save(); }
    

    if(user && await bcrypt.compare(password, user.password)){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1yr"});
        res.status(200).json({user: user, token: accessToken});
    }else{
        res.status(400);
        throw new Error("Password is not valid");
    }

});

const profileUpdate = asyncHandler(async(req,res) => {
    try {
        console.log('Profile update request:', req.body);
        console.log('User ID from token:', req.user?.id);
        
        const {uname,email,phoneNo,address,pincode,emergencyMail,emergencyNo,extraEmail1,extraEmail2,extraPhone1,extraPhone2} = req.body;
        const user = await User.findById(req.user.id);
        
        if(user){
            user.uname = uname;
            user.email = email;
            user.phoneNo = phoneNo;
            user.address = address;
            user.pinCode = pincode;
            user.emergencyMail = emergencyMail;
            user.emergencyNo = emergencyNo;
            user.extraEmail1 = extraEmail1;
            user.extraEmail2 = extraEmail2;
            user.extraPhone1 = extraPhone1;
            user.extraPhone2 = extraPhone2;

            await user.save();
            console.log('User updated successfully');
            res.status(200).json({message: "User updated successfully"});
        } else {
            console.log('User not found with ID:', req.user.id);
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({message: "Profile update failed", error: error.message});
    }
})

const toggleTwilioSms = asyncHandler(async(req,res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        user.twilioSmsEnabled = !user.twilioSmsEnabled;
        await user.save();
        
        res.status(200).json({
            message: `Twilio SMS ${user.twilioSmsEnabled ? 'enabled' : 'disabled'}`,
            twilioSmsEnabled: user.twilioSmsEnabled
        });
    } catch (error) {
        console.error('Toggle SMS error:', error);
        res.status(500).json({message: "Failed to toggle SMS", error: error.message});
    }
})







       



const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });
    const resetToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    user.resetPasswordToken = resetToken;
    await user.save();
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click the link below to reset your password. This link expires in 15 minutes.</p><a href="${resetLink}">${resetLink}</a>`
        });
    } catch (e) {
        return res.status(500).json({ message: 'Failed to send reset email' });
    }
    res.status(200).json({ message: 'Password reset email sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ _id: decoded.id, resetPasswordToken: token });
        if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        await user.save();
        res.status(200).json({ message: 'Password reset successful' });
    } catch (e) {
        res.status(400).json({ message: 'Invalid or expired reset token' });
    }
});

module.exports = {
    userInfo,
    registerUser,
    loginUser,
    verifyemail,
    profileUpdate,
    toggleTwilioSms,
    forgotPassword,
    resetPassword
}