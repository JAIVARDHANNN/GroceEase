import Product from "../models/Product.js"
import Order from "../models/Order.js"
//Place Order COD  : /api/order/cod

export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId; 

    const { items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    const products = await Promise.all(
      items.map(item => Product.findById(item.product))
    );

    let amount = 0;

    for (let i = 0; i < items.length; i++) {
      const product = products[i];
      const quantity = items[i].quantity;

      if (!product) {
        return res.json({ success: false, message: `Product not found: ${items[i].product}` });
      }

      amount += product.offerPrice * quantity;
    }

    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD"
    });

    return res.json({ success: true, message: "Order Placed Successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


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