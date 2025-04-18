const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/", cartController.addToCart);
router.get("/:userId", cartController.getCart);
router.delete("/:id", cartController.removeFromCart);
router.delete("/clear/:userId", cartController.clearCart);

module.exports = router;
