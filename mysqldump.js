var mysql = require("mysql");

var con = mysql.createConnection({
    host: 'nilairapp.cse5wupwp8xc.ap-south-1.rds.amazonaws.com',
    port: '13306',
    user: 'admin',
    password: 'root1234567890',
    database: 'test'
});

con.query('select * from employees', function (err, result) {
    if (err) {
        console.log("Not able to execute query ", err);
    } else {
        result.forEach((eachRow) => {
            console.log(eachRow.uid);
            console.log(eachRow.username)
        });
    }
});

con.end();
console.log();