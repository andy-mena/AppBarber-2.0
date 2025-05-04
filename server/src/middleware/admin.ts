import type { Request, Response, NextFunction } from "express"
import AppError from "../errors/AppError";

export const isAdmin = (request: Request, response: Response, next: NextFunction) => {

    if(request.user && request.user.admin){
        next();
    } else {
        return next(new AppError('No tienes permisos para acceder a este recurso', 403));
    }

}