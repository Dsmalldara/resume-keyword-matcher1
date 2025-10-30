import { Request, Response, NextFunction } from 'express'
import {supabase} from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

declare global {
    namespace Express {
        interface Request {
            user?: User | null;
        }
    }
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Use .get() method which is case-insensitive
    const authHeader =  req.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    console.log("Auth header received:", authHeader); // Add this to debug
    console.log("Token extracted:", token?.substring(0, 20) + "..."); // Add this

    if(!token){
        console.log("No token found"); // Add this
        return res.status(401).json({error: 'Unauthorized'})
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if(error || !user){
        console.log("Supabase auth error:", error); // Add this
        return res.status(401).json({error: 'Unauthorized'})
    }
    
    req.user = user;
    next();
}