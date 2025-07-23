import { CookieOptions } from "express";

const JWT_EXPIRE = parseInt(process.env.JWT_EXPIRE||"48", 10 );

// options for cookies
export const tokenOptions:CookieOptions = {
    maxAge: JWT_EXPIRE * 60 * 60 * 1000, // Convert hours to milliseconds
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
};