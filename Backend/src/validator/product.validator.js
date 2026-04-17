import { body,validationResult} from "express-validator";



const validateProductRequest=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            
            success:false,
            message:'Validation error',
            errors:errors.array()
        })
    }
    
    next();
}


export const validateProduct=()=>{
    return [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('priceAmount').isNumeric().withMessage('Price amount must be a number'),
        body('priceCurrency').isIn(['USD','EUR','GBP']).withMessage('Price currency must be USD, EUR or GBP'),
        validateProductRequest
        
        ]
}
