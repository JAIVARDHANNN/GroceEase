import Product from "../models/Product.js"
import Order from "../models/Order.js"
import Stripe from "stripe"

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

//Place Order Stripe  : /api/order/stripe

 const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;
    const origin = req.headers.origin || req.headers.referer || process.env.FRONTEND_URL || "http://localhost:5173";


    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid order data" });
    }

    let amount = 0;
    let productData = [];

    const products = await Promise.all(
      items.map(item => Product.findById(item.product))
    );

    for (let i = 0; i < items.length; i++) {
      const product = products[i];
      const quantity = items[i].quantity;

      if (!product) {
        return res.json({
          success: false,
          message: `Product not found: ${items[i].product}`
        });
      }

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: quantity,
      });

      amount += product.offerPrice * quantity;
    }

    // Add 2% tax
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online"
    });

    // Stripe line items
    const line_items = productData.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price * 1.02 * 100), // with 2% tax
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // ✅ From middleware

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
//Get all the orders for (seller / admin) : /api/order/seller
export const getAllOrders = async(req , res)=>{
     try {
       
        const orders = await Order.find({ 
            $or:[{paymentType: "COD"} , {isPaid : true}]
        }).populate("items.product address").sort({createdAt : -1});

        return res.json({success:true , orders})
     } catch (error) {
        return res.json({success:false , message:error.message})
     }
}