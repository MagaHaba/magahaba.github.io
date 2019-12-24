const http = require("http");
const fs = require("fs");
const { parse } = require('querystring');
let base = require("./data.json");
let dialog = [];
console.log(base);
http.createServer((request, response) => {
    console.log(request.url);
    console.log(request.method);
    console.log(request.headers);
    if (request.url.endsWith('.css')) {
        fs.readFile("./frontEnd/styles/mainstyle.css", (err, data) => {
            response.setHeader('Content-Type', 'text/css');
            response.statusCode = 200;
            response.write(data);
            response.end();
        });
    } else {
        switch (request.url) {
            case '/': // Дкфолтный запрос к Index страничке
                response.writeHead(200, { 'Content-Type': 'text/html' }); // Возвращаем браузеру, что всё ОК
                let data = fs.readFileSync("./frontEnd/index.html", "utf8"); // Читаем нашу Index.html страничку в переменную
                dialorView = "";
                dialorView1 = "";
                dialog = [];
                for (let i = 0; i < base.length; i++) {
                    if (base[i].middlename == '') {
                        base[i].middlename = 'Smith';
                    }
                    if (base[i].surname == '') {
                        base[i].surname = 'Smith';
                    }
                    if (base[i].name == '') {
                        base[i].name = 'Smith';
                    }
                    dialog.push('<p>' + base[i].surname + " " + base[i].name + " " + base[i].middlename + '</p>');
                    dialorView = dialog.toString().replace(/\,/g, ' ');
                }
                console.log(dialorView);
                dialorView1 = dialorView + "{message}";
                data = data.replace("{message}", dialorView1);
                response.end(data); // Отправляем браузеру переменную, которая содежит html страничку
            case '/send':
                if (request.method === 'POST') {
                    let body = '';
                    let k = 0;
                    request.on('data', chunk => {
                        body += chunk.toString();
                        let bodyParse = parse(body);
                        console.log(bodyParse);
                        for (let i = 0; i < base.length; i++) {
                            if ((base[i].surname == (bodyParse.userSurname || 'Smith')) && (base[i].name == (bodyParse.userName || 'Smith')) && (base[i].middlename == (bodyParse.userMiddlename || 'Smith'))) {
                                k = 1;
                            }
                        }
                        dialorView = "";
                        dialorView2 = "";
                        dialog = [];
                        if (k == 0) {
                            base.push({ name: bodyParse.userName, surname: bodyParse.userSurname, middlename: bodyParse.userMiddlename, dateofbirth: bodyParse.userDateofbirth, age: bodyParse.userAge, education: bodyParse.userEducation });
                            console.log('base');
                            console.log(base);
                            response.writeHead(200, { 'Content-Type': 'text/html' });
                            let data = fs.readFileSync("./frontEnd/index.html", "utf8");
                            for (let i = 0; i < base.length; i++) {
                                if (base[i].middlename == '') {
                                    base[i].middlename = 'Smith';
                                }
                                if (base[i].surname == '') {
                                    base[i].surname = 'Smith';
                                }
                                if (base[i].name == '') {
                                    base[i].name = 'Smith';
                                }
                                dialog.push('<p>' + base[i].surname + " " + base[i].name + " " + base[i].middlename + '</p>');
                                dialorView = dialog.toString().replace(/\,/g, ' ');
                            }
                            console.log(dialorView);
                            dialorView2 = dialorView + "{message}";
                            data = data.replace("{message}", dialorView2);
                            response.end(data);
                            fs.writeFileSync("./data.json", JSON.stringify(base));
                        }
                        if (k == 1) {
                            console.log('Уже есть такой пользователь');
                            let data = fs.readFileSync("./frontEnd/index.html", "utf8");
                            for (let i = 0; i < base.length; i++) {
                                if (base[i].middlename == '') {
                                    base[i].middlename = 'Smith';
                                }
                                if (base[i].surname == '') {
                                    base[i].surname = 'Smith';
                                }
                                if (base[i].name == '') {
                                    base[i].name = 'Smith';
                                }
                                dialog.push('<p>' + base[i].surname + " " + base[i].name + " " + base[i].middlename + '</p>');
                                dialorView = dialog.toString().replace(/\,/g, ' ');
                            }
                            console.log(dialorView);
                            dialorView2 = dialorView + "{message}";
                            data = data.replace("{message}", dialorView2);
                            response.end(data);
                        }
                        /*let chat = {}
                        chat.mess.push({surname: bodyParse.userSurname, name: bodyParse.userName});*/
                        //dialog.push('<p>' + bodyParse.userSurname + " " + bodyParse.userName + " " + bodyParse.userMiddlename + '</p>');
                        /*dialog.push('<p>' + bodyParse.userName +  '</p>');
                        dialog.push('<p>' + bodyParse.userMiddlename +  '</p>');*/
                        //let dialorView = dialog.toString().replace(/\,/g, ' ');
                    })
                }
        }
        console.log('Chat: ' + dialog);
    }

}).listen(2000);