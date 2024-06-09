const path = require('path')
const productModel = require('../model/productModel');
const { json } = require('express');
const fs = require("fs")
const createProduct = async (req, res) => {

    //check incoming data
    console.log(req.body)
    console.log(req.files)

    //Destructuring the body data(json)
    const { productName, productPrice, productCategory, productDescription } = req.body;

    //Validation
    if (!productName || !productPrice || !productCategory || !productDescription) {
        return res.status(400).json({
            "sucess": false,
            "message": "Eanter all fields"
        })
    }

    //validate if there is image
    if (!req.files || !req.files.productImage) {
        return res.status(400).json({
            "sucess": false,
            "message": "Image not found!"
        })
    }
    const { productImage } = req.files;

    //upload image
    //1. Generate new image name (abc.png)->(21343-abc.png)
    const imageName = ` ${Date.now()}-${productImage.name}`

    //2. Make a upload path (/path/upload - diractory)
    const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

    //3. Move to that directory (await, try-catch)
    try {
        await productImage.mv(imageUploadPath)

        // save to data base 
        const newProduct = new productModel({
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productDescription: productDescription,
            productImage: imageName
        })
        const product = await newProduct.save()
        res.status(201).json({
            "success": true,
            "message": "Product Created Successfully",
            "data": product
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error!",
            "error": error
        })

    }
};

// fetch all products
const getAllProducts = async (req, res) => {
    // try catch
    try {
        const allProducts = await productModel.find({})
        res.status(201).json({
            "success": true,
            "message": "Product fetched Successfully",
            "products": allProducts
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error!",
            "error": error
        })
    }
    // fetch all products
    // Send response

}

// feach single product
const getSingleProduct = async (req, res) => {
    // get product if from url(params)
    const productId = req.params.id;
    // find 
    try {
        const product = await productModel.findById(productId)
        if (!product) {
            res.status(400).json({
                "success": false,
                "message": "Product Not Found"
            });
        }
        res.status(201).json({
            "success": true,
            "message": "Product Fetch",
            "product": product
        }

        );
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error!",
            "error": error
        })

    }

}
const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id)
        res.status(201).json({
            "success": true,
            "message": "Product delete Successfully"
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error!",
            "error": error
        })

    }
}
// update product 
// 1.get product id (url)
// 2. if image :
// 3.New image should be uploaded
// 4. old image should be delete
// 5.find product(database) product image
// 6.find the image in diaractory
// 7.Delete
// 8.update the product

const updateProduct = async (req, res) => {
    try {
        if (req.files && req.files.productImage) {
            //destructuring 
            const { productImage } = req.files;

            //upload image to / public/products folders
            //1. generate new image name( abc.png cha bhani  chnage hunu paryo 123-abc.png)
            const imageName = `${Date.now()}-${productImage.name}`;
            //2. make a upload path(/path/upload - directory huncha)
            const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`);

            //move to folder 
            await productImage.mv(imageUploadPath);

            //req.params (id), req.body (updated data: pp, pn =, pc, pd ), req.files (image)
            //add new field to req.body (product image -> name)
            req.body.productImage = imageName; // image uploaded (generated name)

            //if image is iploaded and req.body is assignmed 
            if (req.body.productImage) {
                //finding existing product
                const existingProduct = await productModel.findById(req.params.id);
                //searching the image in directory
                const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.productImage}`);
                //delete old image from the file system 
                fs.unlinkSync(oldImagePath);
            }

        }

        //update the data
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body,);
        res.status(201).json({
            "success": true,
            "message": "Product updated successfully",
            "data": updatedProduct
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct
};