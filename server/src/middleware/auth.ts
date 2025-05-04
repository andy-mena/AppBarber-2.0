import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import User from '../models/User';
import AppError from '../errors/AppError';

declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}

export const authenticate = async (request: Request, response: Response, next: NextFunction) => {
    const bearer = request.headers.authorization;

    if (!bearer) {
        return next(new AppError('Token no proporcionado', 401));
    }

    const token = bearer.split(' ')[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded === 'object' && decoded.id) {

            const user = await User.findByPk(decoded.id);

            if (user) {

                //almacenamos en el request al usuario para hacerlo accesible en los otros request
                request.user = user
                next();

            } else {
                //en caso de que el usuario haya eliminado su cuenta pero el token exista
                return next(new AppError('Token no valid o Expirado', 401));
            }
        }

    } catch (error) {
        next(error)
    }

}