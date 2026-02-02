const express = require("express");
const {
  insertSampleProducts,
  getProductStats,
  getProductAnalytics,
} = require("../controllers/product-controller");

const router = express.Router();

router.post("/add", insertSampleProducts);
router.get("/stats", getProductStats);
router.get("/analysis", getProductAnalytics);

module.exports = router;
