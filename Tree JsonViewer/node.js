const url = require('url'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    open = require('open');

const write = (response, code, type, data) => {
    response.writeHead(code, { 'Content-Type': type });
    if (data) response.write(data);
    response.end();
};

const app = http.createServer((request, response) => {
    try {
        const requestUrl = url.parse(request.url, true);
        const jsonUrl = requestUrl.query.jsonUrl;

        if (jsonUrl) {
            let protocol = jsonUrl.split(':')[0] === 'http' ? http : https;

            protocol.get(jsonUrl, resp => {
                let data = '';
                resp.on('data', chunk => (data += chunk));
                resp.on('end', () => write(response, 200, 'text/json', data));
                resp.on('error', e => write(response, 500, 'text/json', e));
            }).on('error', e => write(response, 500, 'text/json', e));
        }
        else {
            var file = __dirname + (requestUrl.path != '/' ? requestUrl.path : '/index.html');
            var contents = fs.readFileSync(file, 'utf8');
            var mime = 'text/' + file.split('.').reverse()[0];
            if (file.indexOf('.ico') >= 0) mime = 'image/x-icon';
            write(response, 200, mime, contents);
        }
    } catch (e) {
        console.log(e);
    }
});

app.listen(1337, '127.0.0.1', () => {
    open('http://127.0.0.1:1337');
});