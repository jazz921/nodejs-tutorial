const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
    Product.findAll()
    .then((result) => {
        console.log(result)
        res.render("shop/index", {
            prods: result,
            pageTitle: "Shop",
            path: "/",
        });
    })
    .catch(error => {
        console.log('Error getting data from database:', error)
    })
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((result) => {
            res.render("shop/product-list", {
                prods: result,
                pageTitle: "Products",
                path: "/products",
            });
        })
        .catch(error => {
            console.log('Error getting data from database:', error) 
        })
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([product]) => {
            console.log(product);
            res.render("shop/product-detail", {
                product: product[0],
                pageTitle: product.title,
                path: "/products",
            });
        })
        .catch((error) =>
            console.log("Error getting a product from database:", error)
        );
};

exports.getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll((products) => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductData = cart.products.find(
                    (prod) => prod.id === product.id
                );
                if (cartProductData) {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.qty,
                    });
                }
            }
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: cartProducts,
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect("/cart");
    });
};

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
    });
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};
