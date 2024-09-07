import { Request, Response } from "express";

class testController {
  static test = (req: Request, res: Response) => {
    const num1 = req.params.num1;
    const num2 = req.params.num2;
    // const total = num1 + num2
    res.send(`<h2> ${num1}, ${num2} </h2>`);
  };
}

export default testController  