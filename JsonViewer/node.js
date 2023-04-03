import url from 'url';
import http from 'http';
//import https from 'https';
import fs from 'fs';
import open from 'open';
import path from 'path';

const write = (response, code, type, data) => {
    response.writeHead(code, { 'Content-Type': type });
    response.write(data);
    response.end();
};

http
    .createServer((request, response) => {
        console.log(`${request.method} ${request.url}`);

        try {           
            const urlObj = url.parse(request.url, true);

            const workingDir = path.resolve();
            const filePath = workingDir + urlObj.path;
            if (filePath.endsWith('/')) filePath += '/index.html';

            const fileContents = fs.readFileSync(filePath, 'utf8');
			
            let mime = 'text/' + filePath.split('.').reverse()[0];
            if (filePath.endsWith('.js')) mime = 'application/javascript';
			
            write(response, 200, mime, fileContents);
        } catch (e) {
            write(response, 500, 'text/json', JSON.stringify({ error: e }));
        }
    })
    .listen(8000, '127.0.0.1', () => {
        open('http://127.0.0.1:8000');
    });