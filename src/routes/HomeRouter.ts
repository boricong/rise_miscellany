import { Request, Response } from 'express';

class HomeRouter {
  static async index(req: Request, res: Response) {
    try {
      res.send('Hello, world!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

export default HomeRouter; // HomeRouter 클래스를 해당 모듈의 기본(default) 내보내는 대상으로 지정