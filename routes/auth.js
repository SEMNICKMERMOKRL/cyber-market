const router = require(express).Router();
const User = require(..modelsUser);
const jwt = require(jsonwebtoken);
const SECRET = secret123;

router.post(register, async (req, res) = {
    const user = await User.create(req.body);
    res.json(user);
});

router.post(login, async (req, res) = {
    const user = await User.findOne(req.body);
    if(!user) return res.status(400).send(Erro);

    const token = jwt.sign({ id user._id }, SECRET);
    res.json({ token });
});

module.exports = router;