import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { IMiddleWare } from "./middleware.interface";


export class AuthMiddleware implements IMiddleWare {

  constructor(private secret: string) {  }
  
  execute(req: Request, res: Response, next: NextFunction): void {

    // Bearer JWT
    if (req.headers.authorization) {
      const jwtHeader = req.headers.authorization.split(' ')[1];
      verify(
        jwtHeader,
        this.secret,
        (err, payload) => {
          if (err) {
            next();
          } else if ( typeof payload !== 'string' && typeof payload !== 'undefined' ) {
            req.user = payload.email;
            next();
          }
        }
      );
    } else {
      next();
    }
  }
  
}