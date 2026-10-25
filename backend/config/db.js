const mysql = require ('mysql2/promise'); // kita menggunakan API Promise dari mysql2, sehingga query dapat di tulis menggunaka aysnc/await
require ("dotenv").config(); // memuat konfigurasi .env kedalam process.env

//Membuat connection pool 
// connection pool mengelola kuiimpulan koneksi database agar server dapat melayani beberapa permintaan tanpa harius membaut koneksi baru setiap kalinya

const db = mysql.createPool({ 
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database :process.env.DB_NAME,
    port : Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit : 10,
}); 

// mengekspor koneksi = memungkinkan file lain menggunakan koneksi database yang sama dengan require("./db")
module.exports = db;