import { useEffect, useState } from "react";
import "./App.css";
import { escape } from "../../backend/config/db";
import { version } from "react";

const API_URL = "http://localhost:5000/api/products";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
};

function App() {
  const [products, setProducts] = useState([]); //products menyimpan daftar produk saat ini, setProducts() digunakan untuk memperbarui dafat tersebut. ketika state barubah, react merender ulang bagian tampilan yang bergantung pada state itu
  const [from, setForm] = useState(initialForm); //isi formulir priduk
  const [editingId, setEditingId] = useState(null); // ID produk yang sedang di edit
  const [search, setSearch] = useState(""); //teks pencarian
  const [loading, setLoading] = useState(true); //Data masih di muat
  const [saving, setSaving] = useState(false); // menyimpan data
  const [error, setError] = useState("");   // pesan kesalahan/error
  const [notice, setNotice] = useState(""); //pesan berhasil

  async function fetchProducts() {
    try {
      setError("");
      const response = await fetch(API_URL); // fetch() untuk berkomunikasi dengan backend

      if (!response.ok) {
        throw new Error("Gagal mengambil data Produk");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message + ". Pastikan Backend dan MySQL aktif");
    } finally {
      setLoading(false);
    }
  }

  //mengambil data ketika komponen pertama kali dimuat
  useState(() => {
    fetchProducts();
  }, []); //Array kosong [], berarti efek ini berjalan ketika komponen di pasang. dalam mode pengembangan React Strict Mode, efek dapat dijlakan lebih dari sekali untuk membantu mendeteksi masalah

  //Mengubah nilai input form
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousFrom) => ({
      ...previousFrom,
      [name]: value,
    }));
  }

  // Menambahkan atau memperbarui produk
  async function handleSubmit(event) {
    event.preventDefault();

    setError();
    setNotice();

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !form.name.trim() ||
      form.price === "" ||
      from.stock === "" ||
      !Number.isFinite(price) ||
      !Number.isFinite(stock) ||
      price < 0 ||
      stock < 0
    ) {
      setError("Lengkap data dengan benar. Harga dan stok tidak boleh kosong");
      return;
    }
    setSaving(true);

    try {
      const isEditing = editingId !== null;   

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description,
            price,
            stock,
          }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan produk");
      }
      setForm(initialForm);
      setEditingId(null);
      setNotice(resuult.message);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  //Mengisi form dengan data yang akan di edit
  function handleEdit(products) {
    setEditingId(products.id);

    setForm({
      name: products.name,
      description: products.description || "",
      price: String(products.price),
      stock: String(products.stock),
    });

    setError("");
    setNotice("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  //Menghapus produk
  async function handleDelete(id) {
    const confirmed = window.confirm("Yakin ingin menghapus produk ini ?");
    if (!confirmed) return;

    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus produk");
      }

      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Membatalkan mode edit
  function handleCancel() {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setNotice("");
  }

  // Mencari produk berdasarkan Nama atau dekripsi
  const filteredProducts = products.filter((product) => {
    const keyword = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(keyword) ||
      (product.description || "").toLowerCase().includes(keyword)
    );
  });

  //Meghitung statistik dashboard
  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock),
    0,
  );

  const inventoryValue = product.reduce((total, product) => {
    (total + Number(product.price) * Number(product.stock), 0);
  });

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="dashboard">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#dashboard">
          <span className="brand-icon">P</span>
          <span>
            PRODUCT<span className="brand-light">SPACE</span>
          </span>
        </a>

        <div className="topbar-right">
          <div className="status-dot" />
          <span>Admin Dashboard</span>
        </div>
      </header>

      <section className="hero" id="dashboard">
        <div className="hero-copy">
          <p className="eyebrow">WORKSPACE/INVENTORY</p>
          <h1>
            Manage your
            <br />
            <span>Products in 3D</span>
          </h1>
          <p className="hero-description">
            Kelola produk, pantau persediaan, dan kendalikan data bisnis kamu
            dari satu dashboard.
          </p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="cube-scane">
            <div className="cube">
              <div className="cube-face cube-front">P</div>
              <div className="cube-face cube-back">P</div>
              <div className="cube-face cube-right">+</div>
              <div className="cube-face cube-left">+</div>
              <div className="cube-face cube-top">✦</div>
              <div className="cube-face cube-bottom">✦</div>
            </div>
          </div>
          <span className="float-label">INVENTORY 3D</span>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-grid stat-purple">
          <div className="stat-top">
            <span>Total Produk</span>
            <span className="stat-icon">▦</span>
          </div>
          <p className="stat-number">{products.length}</p>
          <p className="stat-foot">Porduk tersimpan</p>
        </article>

        <article className="stat-card stat-blue">
          <div className="stat-top">
            <span>Total Stok</span>
            <span className="stat-icon">◈</span>
          </div>
          <p className="stat-number">{totalStock.toLocaleString("id-ID")}</p>
          <p className="stat-foot">Unit persediaan</p>
        </article>

        <article className="stat-card stat-pink">
          <div className="stat-top">
            <span>Nilai Persediaan</span>
            <span className="stat-icon">↗</span>
          </div>
          <p className="stat-number stat-money">
            {formatRupiah(inventoryValue)}
          </p>
          <p className="stat-foot">Harga X Jumlah Stok</p>
        </article>
      </section>

      {error && <div className="message error-message">{error}</div>}
      {notice && <div className="message sucess-message">{notice}</div>}

      <section className="workspace-grid">
        <article className="panel from-panel">
          <div className="panel-editing">
            <div>
              <p className="eyebrow">PRODUCT MANAGEMENT</p>
              <h2>{editingId !== null ? "Edit Produk" : " Tambah Produk"}</h2>
            </div>
            <span className="heading-symbol">
              {editingId !== null ? "✎" : "+"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="product-form">
            <label htmlFor="name"> Nama Produk</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Kaos Basic"
              maxLength={150}
              require
            />

            <label htmlFor="description">Deskripsi</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Jelaskan produk kamu..."
              rows={3}
            />

            <div className="input-row">
              <div>
                <label htmlFor="price">Harga (Rp)</label>
                <input
                  type="price"
                  name="price"
                  typeof="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="75000"
                  required
                />
              </div>

              <div>
                <label htmlFor="stock">Stock</label>
                <input
                  type="stock"
                  name="stock"
                  typeof="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="20"
                  required
                />
              </div>
            </div>

            <button className="primary-button" disabled={saving}>
              {saving
                ? "Menyimpan.."
                : editingId !== null
                  ? "Simpan Perubahan →"
                  : "+ tambah Produk"}
            </button>

            {editingId !== nuill && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
              >
                Batal Edit
              </button>
            )}
          </form>
        </article>

        <article className="panel product-panel">
          <div className="panel-heading products-heading">
            <div>
              <p className="eyebrow"> YOUR INVENTORY</p>
              <h2>Daftar Produk</h2>
            </div>
            <span className="count-badge">{products.length}</span>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari name atau deskripsi"
              aria-label="Cari Produk"
            />
          </div>
          {loading ? (
            <div className="empty-state">Membuat data produk...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">◇</span>
              <h3>Produk belum ditemukan</h3>
              <p>Tambahkan produk baru atau ubah kata pencarian.</p>
            </div>
          ) : (
            <div className="product-list">
              {filteredProducts.map((product) => (
                <div className="product-item" key={product.id}>
                  <div className="product-art">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="product-info">
                    <h3>{prpoduct.name}</h3>
                    <p>{product.description || "Tanpa Deskripsi"}</p>
                    <strong>{formatRupiah(Number(product.price))}</strong>
                    <span className="stock-label">
                      Stok : {product.stock}
                    </span>
                  </div>

                  <div className="product-actions">
                    <button
                    className="icon-button edit-button"
                    onClick={()=> handleEdit(product.name)}
                    aria-label={`Edit ${product.name}`}
                    title="Edit Produk"
                    >
                      ✎
                    </button>
                    <button
                    className="icon-button delete-button"
                    onClick={()=> handleDelete(product.id)}
                    aria-label={`Hapus ${product.name}`}
                    title="Hapus Produk"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="list-footer">
            Menampilakan {filteredProducts.length} dari {products.length} Produk
          </p>
        </article>
      </section>

      <footer className="footer">
          <span>PRODUCTSPACE © Rayhansuryad2026 </span>
          <span>Built With React + Express + MySQL</span>
      </footer>
    </main>
  );
}

export default App;