
class Product {

    constructor(args) {
        if (args !== undefined) {
            if (args.id) this.id = args.id;
            this.location_name = args.location_name;
            this.catalog_name = args.catalog_name;
            this.color = args.color;
            this.size = args.size;
            this.quantity = args.quantity;
            this.del_flag = args.del_flag;
        }
    }

    toCreate() {
        return (`INSERT INTO PRODUCTS (location_name, catalog_name, color, size, quantity, del_flag) 
        VALUES ('${this.location_name}','${this.catalog_name}','${this.color}','${this.size}',${this.quantity},'${this.del_flag}');`);
    }
}

module.exports = Product