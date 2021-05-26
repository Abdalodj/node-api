const mysql = require('mysql');

class Database {
    
    constructor(config) {
        this.connection = mysql.createConnection(config);
        if (this.connection) {
            console.log('Connected to MySQL');
        }
    }

    query(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, results) => {
                if(err) return reject(err);

                return resolve(results);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err) reject(err);
            });
        });
    }
}

module.exports = Database;