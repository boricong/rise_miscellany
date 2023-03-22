import { Request, Response } from 'express';
import FTPFileList from '../services/FTPFileList'; // FTPFileList 클래스 파일 경로를 적절하게 지정

class RestAPIRouter {
  static async index(req: Request, res: Response) {
    try {
      const ftpFileList = FTPFileList.getInstance(); // FTPFileList 인스턴스 가져오기
      const fileList = ftpFileList.getFileList(); // FTPFileList 인스턴스로부터 파일 목록 가져오기
      const fileListJson = JSON.stringify(fileList); // 파일 목록을 JSON 형태로 변환

      res.setHeader('Content-Type', 'application/json');
      res.send(fileListJson); // JSON 형태의 파일 목록 반환
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

export default RestAPIRouter; // HomeRouter 클래스를 해당 모듈의 기본(default) 내보내는 대상으로 지정