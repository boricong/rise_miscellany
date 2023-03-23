import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as ftp from 'basic-ftp';
import { CronJob } from 'cron';
import path from 'path';

interface FileInfo {
  fileName: string;
  fileSize: number;
  creationDate: Date;
  path: string;
}

class RetrieveFTPInfo {

  private static instance: RetrieveFTPInfo;
  private fileList: FileInfo[] = [];

  private constructor() {}

  public static getInstance(): RetrieveFTPInfo {
    if (!RetrieveFTPInfo.instance) {
      RetrieveFTPInfo.instance = new RetrieveFTPInfo();
      RetrieveFTPInfo.instance.init();
    }
    return RetrieveFTPInfo.instance;
  }

  private init(): void {
    // yaml 파일에서 ftp 접속 정보와 수집 경로를 가져온다.
    //const configPath = path.join(__dirname, '..', 'config.yml');
    const ftpConfig: any = yaml.load(
      fs.readFileSync('./config.yml', 'utf8')
    );
    const ftpClient = new ftp.Client();
    ftpClient.ftp.verbose = false;

      // 5분마다 ftp 파일 정보를 가져와서 리스트에 저장한다.
    const job = new CronJob('0 */5 * * * *', async () => {
      try {
        await ftpClient.access({
          host: ftpConfig.ftp.host,
          user: ftpConfig.ftp.user,
          password: ftpConfig.ftp.password,
        });
        await ftpClient.cd(ftpConfig.ftp.remotePath);
        const fileList: any = await ftpClient.list();

        this.fileList = fileList.map((FileInfo: any) => ({
          fileName: FileInfo.name,
          fileSize: FileInfo.size,
          creationDate: FileInfo.date,
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
const ftpFileList = RetrieveFTPInfo.getInstance();

export default RetrieveFTPInfo;


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
