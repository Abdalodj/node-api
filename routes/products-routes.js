const express = require('express');
const prodCtrl = require('../controllers/products');

const router = express.Router();

router.post('/', prodCtrl.createProduct)

router.post('/upload', prodCtrl.uploadfile)

router.put('/:id', prodCtrl.modifyProduct);

router.delete('/:id', prodCtrl.deleteProduct);

router.get('/:id',  prodCtrl.getOneProduct);

router.get('/', prodCtrl.getAllProduct);

module.exports = router;