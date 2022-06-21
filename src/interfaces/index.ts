import { NextFunction, Request, Response } from "express";

export interface IUserProps {
  name: string;
  email: string;
  _id: string;
}

export type RequestFunc = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<any>;
