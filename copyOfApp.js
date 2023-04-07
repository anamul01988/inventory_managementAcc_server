const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

//schema design
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a name for this product."],
      trim: true, //samne piconer space remove kore dibe
      unique: [true, "Name must be unique"],
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [100, "Name is too large"],
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price can't be nagative"],
    },
    unit: {
      type: String,
      required: true,
      enum: {
        values: ["kg", "litre", "pcs"],
        message: "unit value can't be {VALUE}, must be kg/litre/pcs",
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "quantity can be negative"],
      validate: {
        validator: (value) => {
          const isInteger = Number.isInteger(value);
          if (isInteger) {
            return true;
          } else {
            return false;
          }
        },
      },
      message: "Quantity must be an integer",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["in-stock", "out-of-stock", "discontinued"],
        message: "Status can't be {VALUE",
      },
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updateAt: {
    //   type: Date,
    //   default: Date.now
    // },
    // supplier: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Supplier"
    // },
    // categories: [{
    //    name: {
    //     type: String,
    //     required: true
    //    },
    //    _id: mongoose.Schema.Types.ObjectId
    // }]
  },
  {
    timestamps: true, //option aivabe kora jay
  }
);

//mongoose middlewares for saving data: pre/ post
productSchema.pre('save', function(next){
  console.log('Before saving data');
  if(this.quantity === 0){
    this.status = 'out-of-stock'
  }
  next()
})
// // post middleware ta lagtace nah
// productSchema.post('save', function(doc, next){
//   console.log('After saving data');
//   next()
// })

productSchema.methods.logger = function(){
  console.log(`Data saved for ${this.name}`);
} //scema inject kora dekhlam jeita data post korar por save hoyer age amake dekhte dilo aivabe change o korte parbo

//schema => model => query
const Product = mongoose.model("Product", productSchema);

app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

//posting to database
app.post("/api/v1/product", async (req, res, next) => {
  //2 ways to post 1. save 2. create

  try {
    //applied save ==
    const product = new Product(req.body);
    if(product.quantity === 0){
      product.status = 'out-of-stock'
    }
    const result = await product.save(); //mongodb compass a gelei dekhte pabo save hoye gece then jehetu return kore tai variable a rakhlam
    result.logger();
    // // console.log(req.body)
    // // res.send('it is working ')
    //applied create ==
    // const result = await Product.create(req.body);
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
});

app.get("/api/v1/product", async(req, res, next)=>{
  try {
    // const products = await Product
    // .where("name").equals(/\w/)
    // .where("quantity").gt(100).lt(600)
    // .limit(2).sort({quantity: -1}); //mongodb er moto ObjectId lagbe nah
    const products = await Product.findById("642f423b80a5b916a5d551d0")
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
})

module.exports = app;
