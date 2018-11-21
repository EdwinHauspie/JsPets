const url = require('url'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    open = require('open');

const app = http.createServer((request, response) => {
    try {
        var query = url.parse(request.url, true);

        if (query.query.url) {
            let protocol = query.query.url.split(':')[0] === 'http' ? http : https;

            protocol.get(query.query.url, resp => {
                let data = '';

                resp.on('data', chunk => (data += chunk));

                resp.on('end', () => {
                    response.writeHead(200, { 'Content-Type': 'text/json' });
                    response.write(data);
                    response.end();
                });
            });

            return;
        }


        var file = query.path != '/' ? query.path : '/index.html';
        //console.log(query);

        var contents = fs.readFileSync(__dirname + file, 'utf8');

        response.writeHead(200, { 'Content-Type': 'text/' + file.split('.').reverse()[0] });
        response.write(contents);
        response.end();
    } catch (e) {
        response.writeHead(500);
        response.write('Error: ' + e.message);
        console.log('Error: ' + e.message);
        response.end();
    }
});

app.listen(1337, '127.0.0.1', () => {
    //console.log('Launching the browser!');
    open('http://127.0.0.1:1337');
});