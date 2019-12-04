const url = require('url'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    open = require('open');

const write = (response, code, type, data) => {
    response.writeHead(code, { 'Content-Type': type });
    response.write(data);
    response.end();
};

const onError = e => write(response, 500, 'text/json', JSON.stringify({ error: e.message }));

http
    .createServer((request, response) => {
        try {
            const requestUrl = url.parse(request.url, true);
            const jsonUrl = requestUrl.query.jsonUrl;

            if (jsonUrl) {
                var jsonProtocol = jsonUrl.startsWith('https') ? https : https;
                var jsonRequest = jsonProtocol.request(jsonUrl, { method: request.method }, jsonResponse => {
                    jsonResponse.on('error', onError);
                    let data = '';
                    jsonResponse.on('data', chunk => (data += chunk));
                    jsonResponse.on('end', () => {
                        var status = jsonResponse.statusCode;
                        if (status == 200) write(response, status, 'text/json', data);
                        else write(response, status, 'text/json', JSON.stringify({ statusCode: status, statusMessage: jsonResponse.statusMessage }));
                    });
                });
                jsonRequest.on('error', onError);
                jsonRequest.end();
                return;
            }

            var file = __dirname + (requestUrl.path != '/' ? requestUrl.path : '/index.html');
            var contents = fs.readFileSync(file, 'utf8');
            var mime = 'text/' + file.split('.').reverse()[0];
            if (file.indexOf('.ico') >= 0) mime = 'image/x-icon';
            write(response, 200, mime, contents);
        } catch (e) {
            onError(e);
        }
    })
    .listen(8000, '127.0.0.1', () => {
        open('http://127.0.0.1:8000');
    });