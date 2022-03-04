var config = require('./dbconfig');
const sql = require('mssql');
const Modules = require('./modules');

async function getOrders ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM ORDERS");
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getOrderItems (id)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT item_id, item_quantity FROM orders_items WHERE order_id = ${id}`);
        pool.close();

        oitems = orders.recordset;
        output = orders.recordset;
        for (let item of oitems) 
        {
            let ind = await getItemsById(item.item_id);
            item["item_name"] = ind.item_name;
        }

        console.log(oitems);
        
        return orders.recordsets[0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getUsers ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM USER_");
        pool.close();
        return orders.recordsets[0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getEmployees ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM USER_ WHERE usertype <> 'admin'");
        pool.close();
        return orders.recordsets[0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function addEmployee (employee)
{
    try
    {
        let pool = await sql.connect(config);
        let newProduct = await pool.request()
        .query(`INSERT INTO USER_ (phone_no, password, usertype, NIC, username, users_name)
                VALUES ('${employee.phone_no}', '${employee.password}', '${employee.usertype}', '${employee.NIC}', 
                        '${employee.username}', '${employee.users_name}')`);

        pool.close();
        return newProduct.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function authenticateUser (username, password)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT * FROM USER_ WHERE username = '${username}' AND password = '${password}'`);
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getFoodCategories ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM Food_category");
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getInventoryCategories ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM Inventory_category");
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getImages ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM images");
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getImagesById (id)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT * FROM images WHERE image_id = ${id}`);
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getTables ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM tables");
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}



async function getInventories ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM inventory");
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getItemCategories ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM item_category");
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getItems ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM items");
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getItemsById (id)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT item_name FROM items WHERE item_id = ${id} `);
        pool.close();
        return orders.recordsets[0][0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getMenuItems (fcat)
{
    try
    {
        //console.log(fcat);
        let pool = await sql.connect(config);
        let id = await pool.request().query(`SELECT category_id FROM Food_category WHERE category_name = '${fcat}'`);
        id = id.recordsets[0][0].category_id.toString();
        let fid = id;
        id = await pool.request().query(`SELECT icategory_id FROM items WHERE category_id = '${id}'`);
        id = id.recordsets[0];
        let icatid = [];
        let icatname = [];
        let complete = [];
        let JsonString = {};
        for (let i=0; i<id.length; i++)
        {
            icatid.push(id[i].icategory_id);
        }
        const unique = (value, index, self) => 
        {
            return self.indexOf(value) === index
        };
        icatid = icatid.filter(unique);
        for (let i=0; i<icatid.length; i++)
        {
            let q = await pool.request().query(`SELECT icategory_name FROM item_category WHERE icategory_id = '${icatid[i]}'`);
            icatname.push(q.recordset[0].icategory_name);
            complete.push(q.recordset[0].icategory_name);
            //console.log(q.recordset[0].icategory_name);
            let r = await pool.request().query(`SELECT item_id, item_name, item_price, item_description, image_id, category_id, icategory_id, quantity, total_price FROM items WHERE menu_status = 'available' AND category_id = '${fid}' AND icategory_id = '${icatid[i]}'`);
            complete.push(r.recordset)
            JsonString[q.recordset[0].icategory_name] = r.recordset;
            //console.log(r.recordset);
        }
        //console.log(complete);
        //console.log(JsonString);
        pool.close();
        return JsonString;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function addOrder (order)
{
    try
    {
        let pool = await sql.connect(config);
        let newProduct = await pool.request()
        .query(`INSERT INTO orders (order_time, total_price, payment_mode, order_status, rating, review, table_id, u_id)
                VALUES ('${order.order_time}', '${order.total_price}', '${order.payment_mode}', '${order.order_status}', 
                        '${order.rating}', '${order.review}', '${order.table_id}', '${order.u_id}')`);
        let id = await pool.request()
        .query(`SELECT order_id FROM orders WHERE order_time = '${order.order_time}' AND order_status = '${order.order_status}' AND table_id = '${order.table_id}'`);
        pool.close();
        return id.recordsets[0][0].order_id;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function addOrdersItems (oid, item)
{
    try
    {
        let pool = await sql.connect(config);
        let newProduct = await pool.request()
        .query(`INSERT INTO orders_items (order_id, item_id, item_quantity)
                VALUES ('${oid}', '${item.item_id}', '${item.item_quantity}')`);
        pool.close();
        return newProduct.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function processOrder (o)
{
    try
    {
        //let o = {...order.body};

        let id = await addOrder (o.order);

        console.log("Hello");

        for (let i=0; i<o.items.length; i++)
        {   
            let newProd = await addOrdersItems (id, o.items[i]);
        }

        return id;
    }
    catch(error)
    {
        console.log(error);
    }
}

module.exports = 
{
    getOrders : getOrders,
    getUsers : getUsers,
    getEmployees : getEmployees,
    addEmployee : addEmployee,
    authenticateUser : authenticateUser,
    getFoodCategories : getFoodCategories,
    getInventoryCategories : getInventoryCategories,
    getImages : getImages,
    getImagesById : getImagesById,
    getTables : getTables,
    getInventories : getInventories,
    getItemCategories : getItemCategories,
    getItems : getItems,
    getOrderItems : getOrderItems,
    getMenuItems : getMenuItems,
    addOrder : addOrder,
    addOrdersItems : addOrdersItems,
    processOrder : processOrder
}