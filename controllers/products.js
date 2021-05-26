const prodModel = require('../models/product');

exports.createProduct = (req, res) => {
    delete req.body.id;
    const product = new prodModel(req.body);
    create(product.toCreate())
        .then(() => res.status(201).json({message: 'Post saved successfully!'}))
        .catch(error => res.status(400).json({error}));
}

exports.modifyProduct = (req, res) => {
    const fields = Object.keys(req.body);
    const values = Object.values(req.body);
    let condition = '';
    fields.forEach((val1, index) => {
        const val2 = (val1 !== "quantity") ? `'${values[index]}'` : values[index];
        const end = ((values.length - 1) === index)? ' ': ', ';
        condition += val1+" = "+val2+end;
    });
    const args = {
        value: condition,
        condition: `id = ${req.params.id}`
    }
    update(args)
        .then(() => res.status(200).json({message: "Thing updated successfully!"}))
        .catch(error => res.status(400).json({error}));
}

exports.deleteProduct = (req, res) => {
    let condition = `id = ${req.params.id}`;
    deleteProd(condition)
        .then(()=> res.status(200).json({message: "Deleted"}))
        .catch(error => res.status(400).json({error}));
}

exports.getOneProduct = (req, res) => {
    const condition = `WHERE id = ${req.params.id}`;
    read(condition)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(404).json({error}));
}

exports.getAllProduct = (req, res) => {
    read('')
        .then(result => res.status(200).json(result))
        .catch(error => res.status(404).json({error}));
}


function create(args) {
    return db.query(args);
}

function read(args) {
    return db.query(`SELECT * FROM PRODUCTS ${args};`);
}

function update(args) {
    return db.query(`UPDATE PRODUCTS SET ${args.value} WHERE PRODUCTS.${args.condition};`);
}

function deleteProd(args) {
    if(args === '' || args === null) {
        return db.query(`DELETE * FROM PRODUCTS;`);
    }
    else {
        return db.query(`DELETE FROM PRODUCTS WHERE ${args};`);
    }
}
