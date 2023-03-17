import express, { Application, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml'; //typescript에서 js-yaml모듈의 type선언필요 (@types/js-yaml)
// import HomeController from './src/controllers/HomeController';
import HomeRouter from './src/routes/HomeRouter';

const app: Application = express();

try {
  const config : any = yaml.load(fs.readFileSync('config.yml', 'utf8'));

  // 정적 파일을 제공하기 위한 경로(/public) 등록  (__dirname : 현재 파일 경로)
  app.use(express.static(path.join(__dirname, '/public')));

  // app.get('/', (req: Request, res: Response) => {
  //   res.send('Hello World!');
  // });

  // GET 요청 처리 (필요에 따라)
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

  // HomeController를 사용하여 /home 경로로의 GET 요청을 처리합니다.
  app.get('/home', HomeRouter.index);

  // 서버 시작
  app.listen(config.port, () => {
    console.log('Server is listening on port 3000!');
  });

  // RestAPI 영역 
  // HTTP Method 별 구분 
  // GET : 조회
  // POST : 생성
  // PUT :  전체 수정
  // DELETE : 삭제
  //PATCH : 수정

  } catch (e) {
    console.log(e)
}