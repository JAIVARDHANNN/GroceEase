import Product from "../models/Product.js"
import Order from "../models/Order.js"
//Place Order COD  : /api/order/cod

export const placeOrderCOD = async(req , res)=>{
        try {
            const {userId , items , address} = req.body;
            if(!address || items.lemgth() === 0){
                return res.json({success:false , message: "Invalid Data"})
            }

            //calculate the amount using items
            let amount = await items.reduce(async (acc , item)=>{
                    const produt =await Product.findById(item.produt);
                    return (await acc) + produt.offerPrice * item.quantity;
            } , 0)

            //add tax charge 2%
            amount += Math.floor(amount *  0.02);

            await Order.create({
                userId,
                items,
                amount,
                address,
                paymentType: "COD"
            });
            return res.json({success:true , message:"Order Place Successfully"})
        } catch (error) {
            return res.json({success:false , message:error.message})
        }
}

//Get order by user id: /api/order/user
export const getUserOrders = async()=>{
     try {
        const { userId }= req.body;
        const orders = await Order.find({userId , 
            $or:[{paymentType: "COD"} , {isPaid : true}]
        }).populate("items.product address").sort({createdAt : -1});

        return res.json({success:true , orders})
     } catch (error) {
        return res.json({success:false , message:error.message})
     }
}

//Get all the orders for (seller / admin) : /api/order/seller
export const getAllOrders = async()=>{
     try {
       
        const orders = await Order.find({ 
            $or:[{paymentType: "COD"} , {isPaid : true}]
        }).populate("items.product address").sort({createdAt : -1});

        return res.json({success:true , orders})
     } catch (error) {
        return res.json({success:false , message:error.message})
     }
}