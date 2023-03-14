const productController = require("../controllers/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post("/", authMiddleware, isAdmin, productController.createProduct);
router.get("/:id", productController.getAProduct);
router.put("/:id", authMiddleware, isAdmin, productController.updateProduct);
router.delete("/:id", authMiddleware, isAdmin, productController.deleteProduct);
router.get("/", productController.getAllProduct);

module.exports = router;
