ONLINE SHOPPING CART - CRUD WEBSITE
===================================

Project files:
- app.js              Express + MySQL backend with CRUD API routes
- schema.sql          Creates database and all four tables
- package.json        Node.js dependencies and start command
- public/index.html   Home page
- public/user.html    Users CRUD page
- public/products.html Products CRUD page
- public/cart.html    Cart CRUD page
- public/orders.html  Orders CRUD page
- public/style.css    Shared styling

SETUP
1. Create a folder and extract this ZIP.
2. Open schema.sql in MySQL Workbench and execute it.
3. Open app.js and change YOUR_MYSQL_PASSWORD to your MySQL root password.
4. Open the project folder in VS Code terminal.
5. Run: npm install
6. Run: npm start
7. Open: http://localhost:3000

NOTES
- Add a user and a product first.
- Use their IDs when adding cart items and orders.
- Passwords are currently accepted as entered for a classroom demo.
  For a real application, hash passwords and use authentication.
- Cart and order records use foreign keys to existing users/products.
