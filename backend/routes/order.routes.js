const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
} = require("../controllers/ordersController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createOrder);
router.get("/:userId", authMiddleware, getUserOrders);

module.exports = router;
