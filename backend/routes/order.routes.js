const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
} = require("../controllers/ordersController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createOrder);
router.post("/status", authMiddleware, updateOrderStatus);
router.get("/:userId", authMiddleware, getUserOrders);
router.get("/user/:userId", authMiddleware, getUserOrders);

module.exports = router;
