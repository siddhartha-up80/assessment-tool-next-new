//@ts-nocheck

import User, { UserT } from "@/models/user";
import jwt from "jsonwebtoken";
import passport from "passport";
import nodemailer from "nodemailer";
import { AddOtp } from "../databaseFunctions/otpRepository";

var GoogleStrategy = require("passport-google-oauth2").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1070345699105-kb0hgmil4jrt0bq65hla4s10i83ahci3.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL:
        "https://assessment-backend-q1ux.onrender.com/auth/google/callback",
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: { emails: { value: any }[]; displayName: any },
      done: (error: any, user?: any) => void
    ) => {
      try {
        let user = await User.findOne({ emailid: profile.emails[0].value });

        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            fullname: profile.displayName,
            emailid: profile.emails[0].value,
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.emailId);
});

passport.deserializeUser(async (emailid: string, done) => {
  try {
    const user = await User.findOne({ emailId: emailid });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const GoogleSignIn = (req: any, res: any, next: any) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

const GoogleSignInCallback = async (req: any, res: any) => {
  passport.authenticate(
    "google",
    {
      failureRedirect: `${process.env.CLIENT_URL}/registerpassport.serializeUser((`,
    },
    async (err: any, user: UserT) => {
      try {
        if (err) {
          return res.redirect("/login");
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });

        res.cookie("jwt", token, { httpOnly: true });
        res.redirect(process.env.CLIENT_URL);
      } catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/register`);
      }
    }
  )(req, res);
};

const GenerateRandomCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code;
};

export const SendOtp = async (email: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const code = GenerateRandomCode().toString();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP To Complete Your Signup",
      html: `<html> <h1>Hi,</h1> <br/><p style="color:grey; font-size:1.2em">Please use the below OTP code to complete your account setup on Tecnod8 Assessment Tool</p><br><br><h1 style="color:orange">${code}</h1></html>`,
    };

    await transporter.sendMail(mailOptions);

    const newOtp = {
      emailId: email,
      otp: code,
    };

    const savedOtp = await AddOtp(newOtp);
    return { data: savedOtp, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const SendPasswordResetLink = async (
  email: string,
  token: string
): Promise<string> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const link = `${process.env.CLIENT_URL}/passwordreset/token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "PASSWORD RESET LINK",
      html: `<html> <h1>Hi,</h1> <br/><p style="color:grey; font-size:1.2em">Please use the below LINK to reset your account password setup on Tecnod8 Assessment Tool and this link is active only for 10 minutes</p><br><br><h1 style="color:orange">${link}</h1></html>`,
    };

    await transporter.sendMail(mailOptions);
    return link;
  } catch (error) {
    return "";
  }
};

export { GoogleSignIn, GoogleSignInCallback };
