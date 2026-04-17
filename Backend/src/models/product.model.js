import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({ 

    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            
            enum:['USD','EUR','GBP'],
            default:'USD'
        }
    },
    images:[
        {
            url:{
                type:String,
                required:true
            }
        }
    ]
},{
    timestamps:true
});

const ProductModel = mongoose.model('product',productSchema);

export default ProductModel;