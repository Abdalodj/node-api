const prodModel = require('../models/product');
const formidable = require('formidable')
const csvToJson = require('convert-csv-to-json')

exports.createProduct = (req, res) => {
    delete req.body.id;
    const product = new prodModel(req.body);
    create(product.toCreate())
        .then(() => res.status(201).json({message: 'Post saved successfully!'}))
        .catch(error => res.status(400).json({error}));
}

exports.uploadfile = (req, res) => {
    var form = new formidable.IncomingForm({multiple: true});
    form.parse(req)

    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/upload/' + file.name;
    })

    form.on('file', function (name, file) {
        let temp = file.name.split('.');
        let extension = temp[temp.length - 1];
        if (extension === 'csv') {
            let json = csvToJson.getJsonFromCsv(file.path);
            if (json[0].hasOwnProperty('"id"')) {
                createManyProduct(fromCSV(json))
                    .then(() => {
                        res.writeHead(200, {'content-type': 'text/plain'});
                        res.write('received upload');
                        res.end(0)
                    })
                    .catch(error => res.status(400).json({error}))
            } else {
                sampleRejectResponse(res);
            }
        } else if (extension === 'xlsx') {
            const excelToJson = require('convert-excel-to-json');

            const result = excelToJson({
                sourceFile: file.path
            });
            if (result['Feuil1']) {
                if (result['Feuil1'][0]['A'] === 'location_name') {
                    result['Feuil1'].shift();
                    createManyProduct(fromXLSX(result['Feuil1']))
                        .then(() => {
                            res.writeHead(200, {'content-type': 'text/plain'});
                            res.write('received upload');
                            res.end(0)
                        })
                        .catch(error => res.status(400).json({error}))
                } else {
                    sampleRejectResponse(res)
                }
            } else sampleRejectResponse(res)
        } else {
            sampleRejectResponse(res);
        }
    })
}

exports.modifyProduct = (req, res) => {
    const fields = Object.keys(req.body);
    const values = Object.values(req.body);
    let condition = '';
    fields.forEach((val1, index) => {
        const val2 = (val1 !== "quantity") ? `'${values[index]}'` : values[index];
        const end = ((values.length - 1) === index) ? ' ' : ', ';
        condition += val1 + " = " + val2 + end;
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
        .then(() => res.status(200).json({message: "Deleted"}))
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
    if (args === '' || args === null) {
        return db.query(`DELETE * FROM PRODUCTS;`);
    } else {
        return db.query(`DELETE FROM PRODUCTS WHERE ${args};`);
    }
}

function createManyProduct(args) {
    return db.query(`INSERT INTO PRODUCTS (location_name, catalog_name, color, size, quantity, del_flag) VALUES ` + args)
}

function fromCSV(json) {
    let newJson = [];
    let requestArg = '';
    json.forEach(value => {
        newJson.push(new prodModel({
            location_name: value['"location_name"'].replace(/"/g, ''),
            catalog_name: value['"catalog_name"'].replace(/"/g, ''),
            color: value['"color"'].replace(/"/g, ''),
            size: value['"size"'].replace(/"/g, ''),
            quantity: value['"quantity"'].replace(/"/g, ''),
            del_flag: value['"del_flag"'].replace(/"/g, ''),
        }))
    })
    newJson.forEach((value, index) => {
        requestArg += ((newJson.length - 1) !== index) ? value.fielValue() + ',' : value.fielValue() + ';';
    })

    return requestArg;
}

function fromXLSX(json) {
    let newJson = [];
    let requestArg = '';
    json.forEach(value => {
        newJson.push(new prodModel({
            location_name: value['A'],
            catalog_name: value['B'],
            color: value['C'],
            size: value['D'],
            quantity: value['E'],
            del_flag: value['F'],
        }));
    })
    newJson.forEach((value, index) => {
        requestArg += ((newJson.length - 1) !== index) ? value.fielValue() + ',' : value.fielValue() + ';';
    })

    return requestArg;
}

function sampleRejectResponse(res) {
    // res.writeHead(401, {'content-type': 'text/plain'});
    // res.write('There is problem with the file');
    // res.end(0)
    return res.status(401).send({message: 'There is problem with the file'})
}