const fs = require('fs');


loadLog = () => {
    const fdate = new Date().toISOString().slice(0, 10);

    const fileName = '../log/' + fdate + '.log';

    const logData = fs.readFileSync(fdate, 'utf-8');

    console.log(fileName)

    const txt = document.getElementById('log');

    txt.innerText = logData;
}