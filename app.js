
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = 3000;

// ================= MIDDLEWARE =================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ================= DATABASE CONNECTION =================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "srividya"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL Database!");
});

// ================= COMMON QUERY FUNCTION =================

function query(sql, values, res) {
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database Error:", err.message);

            return res.status(500).json({
                message: "Database operation failed",
                error: err.message
            });
        }

        res.json(result);
    });
}

// ================= USERS CRUD =================

// VIEW ALL USERS
app.get("/api/users", (req, res) => {
    query(
        "SELECT user_id, name, email, phone FROM users ORDER BY user_id",
        [],
        res
    );
});

// ADD USER
app.post("/api/users", (req, res) => {
    const { name, email, phone, password } = req.body;

    query(
        "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
        [name, email, phone, password],
        res
    );
});

// UPDATE USER
app.put("/api/users/:id", (req, res) => {
    const { name, email, phone, password } = req.body;

    query(
        "UPDATE users SET name=?, email=?, phone=?, password=? WHERE user_id=?",
        [name, email, phone, password, req.params.id],
        res
    );
});

// DELETE USER
app.delete("/api/users/:id", (req, res) => {
    query(
        "DELETE FROM users WHERE user_id=?",
        [req.params.id],
        res
    );
});


// ================= PRODUCTS CRUD =================

// VIEW ALL PRODUCTS
app.get("/api/products", (req, res) => {
    query(
        "SELECT * FROM products ORDER BY product_id",
        [],
        res
    );
});

// VIEW SINGLE PRODUCT
app.get("/api/products/:id", (req, res) => {
    query(
        "SELECT * FROM products WHERE product_id=?",
        [req.params.id],
        res
    );
});

// ADD PRODUCT
app.post("/api/products", (req, res) => {
    const {
        product_name,
        category,
        price,
        stock,
        description
    } = req.body;

    query(
        `INSERT INTO products
        (product_name, category, price, stock, description)
        VALUES (?, ?, ?, ?, ?)`,
        [product_name, category, price, stock, description],
        res
    );
});

// UPDATE PRODUCT
app.put("/api/products/:id", (req, res) => {
    const {
        product_name,
        category,
        price,
        stock,
        description
    } = req.body;

    query(
        `UPDATE products
        SET product_name=?, category=?, price=?, stock=?, description=?
        WHERE product_id=?`,
        [
            product_name,
            category,
            price,
            stock,
            description,
            req.params.id
        ],
        res
    );
});

// DELETE PRODUCT
app.delete("/api/products/:id", (req, res) => {
    query(
        "DELETE FROM products WHERE product_id=?",
        [req.params.id],
        res
    );
});


// ================= CART CRUD =================

// VIEW CART
app.get("/api/cart", (req, res) => {

    const sql = `
        SELECT
            c.cart_id,
            c.user_id,
            u.name,
            c.product_id,
            p.product_name,
            p.price,
            c.quantity,
            c.added_date,
            (p.price * c.quantity) AS item_total
        FROM cart c
        JOIN users u ON c.user_id = u.user_id
        JOIN products p ON c.product_id = p.product_id
        ORDER BY c.cart_id
    `;

    query(sql, [], res);
});

// ADD TO CART
app.post("/api/cart", (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [user_id, product_id, quantity],
        res
    );
});

// UPDATE CART
app.put("/api/cart/:id", (req, res) => {
    query(
        "UPDATE cart SET quantity=? WHERE cart_id=?",
        [req.body.quantity, req.params.id],
        res
    );
});

// DELETE CART ITEM
app.delete("/api/cart/:id", (req, res) => {
    query(
        "DELETE FROM cart WHERE cart_id=?",
        [req.params.id],
        res
    );
});


// ================= ORDERS CRUD =================

// VIEW ALL ORDERS
app.get("/api/orders", (req, res) => {

    const sql = `
        SELECT
            o.order_id,
            o.user_id,
            u.name,
            o.total_amount,
            o.order_date,
            o.status
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        ORDER BY o.order_id
    `;

    query(sql, [], res);
});

// ADD ORDER
app.post("/api/orders", (req, res) => {
    const { user_id, total_amount, status } = req.body;

    query(
        "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)",
        [user_id, total_amount, status || "Pending"],
        res
    );
});

// UPDATE ORDER
app.put("/api/orders/:id", (req, res) => {
    query(
        `UPDATE orders
        SET user_id=?, total_amount=?, status=?
        WHERE order_id=?`,
        [
            req.body.user_id,
            req.body.total_amount,
            req.body.status,
            req.params.id
        ],
        res
    );
});

// DELETE ORDER
app.delete("/api/orders/:id", (req, res) => {
    query(
        "DELETE FROM orders WHERE order_id=?",
        [req.params.id],
        res
    );
});


// ================= HOME PAGE =================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});


// ================= SERVER =================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
