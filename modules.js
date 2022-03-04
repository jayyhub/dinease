class User
{
    constructor (phone_no, password, usertype, NIC, username, users_name)
    {
        this.phone_no = phone_no;
        this.password = password;
        this.usertype = usertype;
        this.NIC = NIC;
        this.username = username;
        this.users_name = users_name;
    }
}

class Food_Category
{
    constructor (category_name, category_description)
    {
        this.category_name = category_name;
        this.category_description = category_description;
    }
}

class Inventory_Category
{
    constructor (category_name, category_description)
    {
        this.category_name = category_name;
        this.category_description = category_description;
    }
}

class Image
{
    constructor (pic_path)
    {
        this.pic_path = pic_path;
    }
}

class Table
{
    constructor (table_status, location_description, no_of_chairs)
    {
        this.table_status = table_status;
        this.location_description = location_description;
        this.no_of_chairs = no_of_chairs;
    }
}

class Item_Category
{
    constructor ( category_name)
    {
        this.category_name = category_name;
    }
}

class Inventory
{
    constructor (inventory_name, date_of_purchase, cost, quantity, total_cost, category_id)
    {
        this.inventory_name = inventory_name;
        this.date_of_purchase = date_of_purchase;
        this.cost = cost;
        this.quantity = quantity;
        this.total_cost = total_cost;
        this.category_id = category_id;
    }
}

class Item
{
    constructor (item_name, item_price, item_description, menu_status, image_id, category_id, icategory_id)
    {
        this.item_name = item_name;
        this.item_price = item_price;
        this.item_description = item_description;
        this.menu_status = menu_status;
        this.image_id = image_id;
        this.category_id = category_id;
        this.icategory_id = icategory_id;
    }
}

class Order
{
    constructor (order_time, total_price, payment_mode, order_status, rating, review, table_id, u_id)
    {
        this.order_time = order_time;
        this.total_price = total_price;
        this.payment_mode = payment_mode;
        this.order_status = order_status;
        this.rating = rating;
        this.review = review;
        this.table_id = table_id;
        this.u_id = u_id;
    }
}

class Order_Item
{
    constructor (order_id, item_id, item_name, item_quantity)
    {
        this.order_id -= order_id;
        this.item_id = item_id;
        this.item_name = item_name;
        this.item_quantity = item_quantity;
    }
}

module.exports = Order_Item;
module.exports = Order;
module.exports = Item;
module.exports = Item_Category;
module.exports = Inventory;
module.exports = Table;
module.exports = Image;
module.exports = Inventory_Category;
module.exports = Food_Category;
module.exports = User;