let express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs');

let app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/', express.static(`${__dirname}/../web`));
app.use('/files', express.static(`${__dirname}/data`));

app.get('/files-list', function(req, res) {
    fs.readdir(`${__dirname}/data`, (err, files) => {
        if (err) {
            res.status(500).json({
                message: err.message
            });
        } else {
            res.json({files});
        }
    });
});

app.post('/save', function(req, res) {
    let data = req.body;

    fs.writeFile(`${__dirname}/data/${data.name}`, JSON.stringify(data.file), function(err) {
        if (err) {
            console.log(`Не удалось сохранить файл ${data.name}\nПричина: ${err.toString()}`);
            res.status(500).send();
        }

        console.log(`Успешно сохранён файл \`${data.name}\``);
        res.status(200).send();
    });
});

app.listen(port, function() {
    console.log(`HTTP-сервер запущен по адресу http://localhost:${port}`);
});
