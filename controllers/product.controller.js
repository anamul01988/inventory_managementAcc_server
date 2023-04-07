const { getProductsService, createProductService } = require("../services/product.services")


exports.getProducts = async(req, res, next)=>{
    try {
      // const products = await Product
      // .where("name").equals(/\w/)
      // .where("quantity").gt(100).lt(600)
      // .limit(2).sort({quantity: -1}); //mongodb er moto ObjectId lagbe nah
    //   const products = await Product.findById("642f423b80a5b916a5d551d0")
      const products = await getProductsService(req.query.limit);
      // $or: [{_id: "642f423b80a5b916a5d551d0" }, {name: "shirtdfdfd"}]
      // status: {$ne: "out-of-stock"}
      // quantity: {$gt: 100}
      // quantity: {$gte: 100}
      // name: {$in: ["Mobile1", "anam"]}
      //  Product.find({}, 'name  qunatity') //projection sudhu name ar quantity show korbe
      //  Product.find({}, '-name  -quantity'); //name ar quantity cara sob show korbe
      // Product.find({}).sort({quantity: -1})// qunatity descending akare show korbe,, 1 dile ascending
      // Product.find({}).select({name: 1}) // sudu name ar id dekhabe , -1 dile name cara baki sob dekhato
      //Product.where("name").equals("anam").where("quantity").gt(100)
      //Product.where("name").equals(/\w/).where("quantity").gt(100).limit(2) //regex use kora hoice jekono namer and jader quantity 100 theke beshi ar limit 2 ta dekhabe
      res.status(200).json({
        status: "success",
        data: products
      })
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: "can't get the data",
        error: error.message
      })
    }
  }



  exports.createProduct = async (req, res, next) => {
    //2 ways to post 1. save 2. create
  
    try {
      //applied save ==
    //   const product = new Product(req.body);
    //   if(product.quantity === 0){
    //     product.status = 'out-of-stock'
    //   }
    //   const result = await product.save(); //mongodb compass a gelei dekhte pabo save hoye gece then jehetu return kore tai variable a rakhlam
    //   result.logger();
      // // console.log(req.body)
      // // res.send('it is working ')
      //applied create ==
      const result = await createProductService(req.body)
      result.logger();
      res.status(200).json({
        status: "success",
        message: "Data inserted successfully :)",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: "Data is not inserted",
        error: error.message,
      });
    }
  }