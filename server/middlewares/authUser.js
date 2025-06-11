import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Unauthorized User" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.user = { id: tokenDecode.id }; // ✅ set as user object
      next();
    } else {
      return res.json({ success: false, message: "Unauthorized User" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
