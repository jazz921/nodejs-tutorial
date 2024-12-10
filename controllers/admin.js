const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
    })
        .then((result) => {
            console.log("Added a New Product!");
            return res.redirect('/admin/products')
        })
        .catch((error) => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;

    Product.findByPk(prodId)
        .then((result) => {
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: result,
            });
        })
        .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    /* 
        BELOW IS ALTERNATIVE WHEN USING ASYNC FUNCTION 
        NOTE: 
        This mutate the table from the database directly while 
        the implement one creates a local copy of the data that was 
        found using findByPk() function then updates it or create a new one when no data is found

    */

    // await Product.update( 
    //     {
    //         title: updatedTitle,
    //         price: updatedPrice,
    //         imageUrl: updatedImageUrl,
    //         description: updatedDesc,
    //     },
    //     {
    //         where: {
    //             id: prodId
    //         }
    //     }
    // );

    Product.findByPk(prodId)
        .then((product) => {
            console.log(product)
            product.title = updatedTitle
            product.price = updatedPrice
            product.imageUrl = updatedImageUrl
            product.description = updatedDesc
            return product.save()
        })
        .then((result) => {
            console.log('Succesfully updated the database')
            return res.redirect("/admin/products");
        })
        .catch((error) => {
            console.log('Error updating the product:', error)
            return res.redirect("/admin/products");
        })

};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((result) => {
            res.render("admin/products", {
                prods: result,
                pageTitle: "Admin Products",
                path: "/admin/products",
            });
        })
        .catch((error) => {
            console.log("Error getting data from database:", error);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // Product.deleteById(prodId);

    /*
        Below is alternative when using async await function
        Note:
        This directly delete a data from the database
        while the implemented one creates a local copy then deletes it
    */

    // await Product.destroy({
    //     where: {
    //         id: prodId
    //     }
    // })

    Product.findByPk(prodId)
        .then((product) => {
            return product.destroy()
        })
        .then(() => {
            return res.redirect("/admin/products");
        })
        .catch((error) => {
            console.log('Error in deleting a data in database:', error)
        })
};
