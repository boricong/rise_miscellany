import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as ftp from 'basic-ftp';
import { CronJob } from 'cron';

interface FileInfo {
  fileName: string;
  fileSize: number;
  creationDate: Date;
  path: string;
}

class FTPFileList {
  private static instance: FTPFileList;
  private fileList: FileInfo[] = [];

  private constructor() {}

  public static getInstance(): FTPFileList {
    if (!FTPFileList.instance) {
      FTPFileList.instance = new FTPFileList();
      FTPFileList.instance.init();
    }
    return FTPFileList.instance;
  }

  private init(): void {
    // yaml 파일에서 ftp 접속 정보와 수집 경로를 가져온다.
    const ftpConfig = yaml.load(
      fs.readFileSync('config.yaml', 'utf8')
    );
    const ftpClient = new ftp.Client();
    ftpClient.ftp.verbose = false;

    // 5분마다 ftp 파일 정보를 가져와서 리스트에 저장한다.
    const job = new CronJob('0 */5 * * * *', async () => {
      try {
        await ftpClient.access({
          host: ftpConfig.host,
          user: ftpConfig.username,
          password: ftpConfig.password,
        });
        await ftpClient.cd(ftpConfig.remotePath);
        const fileList = await ftpClient.list();
        this.fileList = fileList.map((file) => ({
          fileName: file.name,
          fileSize: file.size,
          creationDate: file.date,
          path: ftpConfig.remotePath,
        }));
        // 생성일 기준으로 리스트를 정렬한다.
        this.fileList.sort(
          (a, b) => a.creationDate.getTime() - b.creationDate.getTime()
        );
        ftpClient.close();
      } catch (err) {
        console.error(`Error fetching FTP file list: ${err}`);
      }
    });

    job.start();
  }

  public getFileList(): FileInfo[] {
    return this.fileList;
  }
}

// 전역에서 접근 가능한 인스턴스 생성
const ftpFileList = FTPFileList.getInstance();

// // REST API를 위한 express.js 라우팅 예시
// import express from 'express';

// const app = express();

// app.get('/ftpFileList', (req, res) => {
//   const fileList = ftpFileList.getFileList();
//   res.json(fileList);
// });

// app.listen(3000, () => {
//   console.log('Listening on port 3000');
// });
