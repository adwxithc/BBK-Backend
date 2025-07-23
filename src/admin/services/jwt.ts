import jwt from "jsonwebtoken";
import { BadRequestError } from "@common/errors/bad-request-error";
import { IJwtPayload } from "@common/types/jwt";



class JWTToken{
    

    createJWT(payload: IJwtPayload,key:string) {

        const verifyToken = jwt.sign(payload, key,{
            expiresIn: "1y"
        });
        return verifyToken;
    }


    verifyJwt(token: string,key:string):Promise<IJwtPayload>{
        
        return new Promise((resolve, reject)=>{
            jwt.verify(token, key,(err, decoded)=>{
                if(err){
                    
                    reject(new BadRequestError("in valid token..!"));
                }else{
                   
                    resolve(decoded as IJwtPayload);
                }
            });
        });
        
    }

}

export const jWTToken = new JWTToken();