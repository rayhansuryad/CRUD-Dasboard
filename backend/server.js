const express = require("express");
const cors = require ("cors"); 
require("dotenv").config();

const db = require("./config/db");
const app = express(); // membuaut aplikasi server
const PORT = process.env.PORT || 5000
// middleware
app.use(cors()); //mengizinkan frontend yang berjalan di origin berbeda untuk mengakses API
app.use(express.json()); //membaca request body JSON dan menyimpanya di req.body
//tanpa express.json(), data JSON dari formuulir react tidak otomatis tersedia di req.body

//tes server
app.get("/", (req, res) => {
  res.json({ message: "Product API berjalan" });
});

// READ : Mengambil semua produk
app.get("/api/products", async (req, res) => {

  try {

    const [products] = await db.query(
      "SELECT * FROM products ORDER BY id DESC",
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ massege: "Gagal mengambil produk" });
  }
});

//READ : mengambil satu produk berdasarkan ID
app.get("/api/products/:id",
  async (req, res) => {
    try {
      const [products] = await db.execute(
        "SELECT * FROM products WHERE id = ?",
        parseInt[req.params.id],
      );

      if (products === 0) {
        return res.status(404).json({ message: "Produk tidak di temukan" });
      }

      res.json(products[0]);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Gagal mengambil produk" });
    }
  });

// Create : Menambahkan produk

app.post("/api/products",async (req, res) => {
    try {
      const { name, description, price, stock } = req.body;

      if (
        typeof name !== "string" ||
        !name.trim() ||
        !Number.isFinite(Number(price)) ||
        !Number.isFinite(Number(stock)) ||
        Number(price) < 0 ||
        Number(stock) < 0
      ) {
        return res.status(400).json({
          message: "Nama, Harga, dan Stock harus di isi dengan benar",
        });
      }
      const [result] = await db.execute(
        `INSERT INTO products (name, description, price, stock) VALUES (?,?,?,?)`, //tanda ? adalah placeholder yag diisi oleh pramater, pendekatan ini membantu mencegah SQL injection dibandingkan menggabungkan input pengguna langsugn ke sting sql
        [name.trim(), description || "", Number(price), Number(stock)],
      );

      res
        .status(201)
        .json({ message: "Produk berhasil ditambahkan", id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal Menambahkan produk" });
    }
  });

  //Update : mengubah produk

  app.put ("/api/products/:id", async (req,res) =>{
    try {
        const {name, description, price, stock} = req.body;

        if (
            typeof name !== "string" || !name.trim() || !Number.isFinite(Number(price)) ||
            !Number.isFinite(Number(stock)) ||
            Number(price) < 0 || Number(stock) < 0
        ) {
            return res.status (400).json({
                message : 'Nama, Harga, dan Stock harus diisi dengan benar'
            });
        }

        const [result] = await db.execute(
            `UPDATE products SET name = ?, description = ?, price = ?, stock = ?`,
            [
                name.trim(),
                description || "",
                Number(price),
                Number(stock),
                parseInt(req.params.id)
            ]
        );
        if (result.affectedRows === 0) {
            return res.status(400).json({message:"Produk tidak di temukan"})
        }
        res.json({message:"produk berhasil di perbarui"});

    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Gagal memperbarui produk'})
    }
  });

  //DELETE : Menghapus produk
  app.delete('/api/products/:id', async (req,res) =>{
    try {
        const [result] = await db.execute(
            'DELETE FROM products WHERE id = ?', [req.params.id]
        );

        if (result.affectedRows === 0){
            return res.status(404).json({message: "Poduk tidak ditemukan"})
        };
        res.json({message:"Produk berhasil di hapus"})

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Produk gagal di hapus"})
    }
  });

  //menjalankan server 
  app.listen(PORT,()=> {
console.log(`Server berjalan di http://localhost:${PORT}`);
});