const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const ejs = require('ejs');
const PORT = 8080;

// Apply session middleware
app.use(session({
    secret: 'secret',
    name: 'uniqueSessionID',
    saveUninitialized: false,
    resave: false,
    loggedIn: false
}));

 // Setup db pooling with pg
 const Pool = require('pg').Pool;
 const pool = new Pool({
     host     : your_localhost,
     database : your_db_name,
     user     : your_username,
     password : your_db_pwd, 
    port     : your_port
});




// Apply ejs middleware for dynamic html templating
const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));
app.set("view engine", "ejs");

// Apply bodyParser middleware to handle http request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


////// Main ('/') route //////


app.get('/', (req, res) => {
    res.render("index", {userData: req.session, cartCount: req.session.cartCount});
});


////// Login route //////


app.get('/login', (req, res) => {
    res.render("login", {userData: req.session, cartCount: req.session.cartCount});
});

app.post('/login', async (req, res) => {
    let storedPass;
    let submittedPass = req.body.password;
    console.log('req.body.password: ');
    console.log(submittedPass);
    pool.query('SELECT * FROM users WHERE username = $1;', [req.body.username], (error, results) => {
        storedPass = results.rows[0].password;
        const user_id = results.rows[0].id;
        console.log('storedPass: ');
        console.log(storedPass);
        if (results === undefined) {
            // msg = 'username not found'
            res.redirect("login");
        } else if (storedPass !== submittedPass) {
            console.log('incorrect pwd');
            res.redirect("login");
        } else {
            console.log('you successfully logged in');
            req.session.username = req.body.username;
            req.session.loggedIn = true;
            req.session.user_id = user_id;
            console.log(req.session.user_id);
            res.redirect('/products');
        }
    })
});


////// Register routes //////


app.get('/register', (req, res) => {
    res.render("register", {userData: req.session, cartCount: req.session.cartCount});
});

app.post('/register', bodyParser.urlencoded({extended:true}), (req, res, next) => {
   pool.query('SELECT * FROM users WHERE username = $1;', [req.body.username], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows[0] != undefined) {
            res.send('Username already exists');
        } else if (req.body.password !== req.body.confirm) {
            res.send('Passwords must match');
        } else {
            pool.query('INSERT INTO users (username, password) VALUES ($1, $2);', [req.body.username, req.body.password], (error, results) => {
                res.redirect("login");
            });
        }
   })
});


////// Products route //////


app.get('/products', async (req, res) => {
    const productData = await pool.query('SELECT * FROM products');
    res.render("products", { productData: productData.rows, userData: req.session, cartCount: req.session.cartCount });
});


////// Cart routes //////


const isProductInCart = (cart, product_id) => {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].product_id == product_id) {
            return true;
        }
    }
    return false;
};

const calculateTotal = (cart, req) => {
    total = 0;
    for (let i = 0; i < cart.length; i++) {
       total = total + (cart[i].price * cart[i].quantity);
    }
    req.session.total = Number.parseFloat(total).toFixed(2);
    return total;
};

const calculateCartCount = (cart, req) => {
    cartCount = 0;
    for (let i = 0; i < cart.length; i++) {
        cartCount = cartCount + parseInt(cart[i].quantity);
    }
    req.session.cartCount = cartCount;
    return cartCount;
};

app.get('/cart', (req, res) => {
    res.render("cart", {cart: req.session.cart, total: req.session.total, userData: req.session, cartCount: req.session.cartCount});
})

app.post('/cart', (req, res) => {
    let { product_id, name, price, quantity } = req.body;
    let product = {
        product_id: product_id,
        name: name,
        price: price,
        quantity: quantity
    }
    let cart;
    if (req.session.cart) {
        cart = req.session.cart;
        if (!isProductInCart(cart, product_id)) {
            cart.push(product);
        }
    } else {
        req.session.cart = [product];
        cart = req.session.cart;
    }

    // Calculate total amount and quantity
    calculateTotal(cart, req);
    calculateCartCount(cart, req);

    // Stay on products page with updated cart
    res.redirect('/products');
});

app.get('/updatecart', (req, res) => {
    console.log(req.query); // { product_id: '1', update_quantity: '+' }
 
    let cart = req.session.cart;
    cart.forEach((itemInCart)=> {
        console.log(itemInCart);
            if (req.query.product_id === itemInCart.product_id) {
                console.log(req.query.product_id);
                console.log(itemInCart.product_id);
                console.log(itemInCart.quantity);
                if ((req.query.update_quantity === '+') && (itemInCart.quantity >= 0)) {
                    itemInCart.quantity = parseInt(itemInCart.quantity) + 1;
                    console.log('itemInCart.quantity: ');
                    console.log(itemInCart.quantity);
                } else if ((req.query.update_quantity === '-') && (itemInCart.quantity > 0)) {
                    itemInCart.quantity = parseInt(itemInCart.quantity) - 1;
                    if (itemInCart.quantity === 0) {
                        // remove item from cart
                        const index = cart.indexOf(itemInCart);
                        console.log('index: ');
                        console.log(index);
                        cart.splice(index, 1);
                        console.log("req.session.cart: ");
                        console.log(req.session.cart);
                        console.log('req.session.cart[0]');
                        console.log(req.session.cart[0]);
                    }
                    console.log('itemInCart.quantity: ');
                    console.log(itemInCart.quantity);
                }
            }        
    calculateTotal(cart, req);
    calculateCartCount(cart, req);
    });

    
    res.redirect("cart");
});


////// Checkout route //////


app.post('/checkout', async (req, res) => {
    const { username, total } = req.body;
    res.render("checkout", { cart: req.session.cart, userData: req.session, total: req.session.total, cartCount: req.session.cartCount })  // with continue shopping btn that links back to /products 
});


////// Checkout/pay route //////


app.post('/checkout/pay', async (req, res) => {
    console.log('customer_id: ');
    const tmp = Date.now();
    const timestamp = new Date(tmp);

    // Store order in orders table
    pool.query('INSERT INTO orders (customer_id, total, order_date) VALUES ($1, $2, $3)', [req.session.user_id, req.body.total, timestamp], (error, results) => {
        if (error) {
            throw error
        }
    });

    // Query orders for unique order_id, store in const
    const orderNum = await pool.query('SELECT order_id FROM orders WHERE customer_id = $1 ORDER BY order_date DESC', [req.session.user_id]);

    // Order has processed, so clear cart, total
    req.session.cart = [];
    req.session.total = 0;
    req.session.cartCount = undefined;
    const confirmationMsg = `Your order no. ${orderNum.rows[0].order_id} will ship soon. Thank you for shopping with Omnibus Cellular.`; 
    req.session.msg = confirmationMsg;
    res.redirect("confirmation");
});


////// Confirmation route //////


app.get('/checkout/confirmation', (req, res) => {
    res.render("confirmation", { userData: req.session, msg: req.session, cartCount: req.session.cartCount })
})


////// My Account route //////


app.get('/account', (req, res) => {
    res.render("account", { userData: req.session, cartCount: req.session.cartCount})
});


////// Orders //////


app.get('/orders', async (req, res) => {
    const orders =  await pool.query('SELECT * FROM orders WHERE customer_id = $1', [req.session.user_id]);
    req.session.orders = orders.rows;
    res.render("orders", { userData: req.session, orders: req.session.orders, cartCount: req.session.cartCount})
})


////// Logout route //////


app.get('/logout', (req, res) => {
    req.session.destroy((err)=>{});
    res.redirect('/login');
});


////// Setup server to listen for requests //////


app.listen(PORT, () => {
    console.log(`Server is listening on port: ${ PORT }`);
});


