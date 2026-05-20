const router = require("express").Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

router.post("/", async (req, res) => {
    const product = await Product.create(req.body);
    res.json(product);
});

router.delete("/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
});

module.exports = router;