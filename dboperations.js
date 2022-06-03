var config = require('./dbconfig');
const sql = require('mssql');
const Modules = require('./modules');

async function getOrders ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM ORDERS INNER JOIN USER_ ON ORDERS.U_id=USER_.u_id WHERE USER_.usertype <> 'admin'");
        pool.close();
        return orders.recordsets[0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getAnOrder ()
{
    try
    {
        let pool = await sql.connect(config);
        let order = await pool.request().query(`SELECT order_id, order_time, total_price, table_id FROM ORDERS INNER JOIN USER_ ON ORDERS.U_id=USER_.u_id WHERE USER_.usertype='admin'`);
        pool.close();
        let incomming_orders = order.recordsets[0]
        for (let single of incomming_orders)
        {
            let itt = await getOrderItems (single.order_id);
            single["items"] = itt;
        }

        console.log(incomming_orders);
        return incomming_orders.reverse();
    }
    catch (error)
    {
        console.log(error);
    }
}

async function assignOrder (order_id, chef_id, order_status, est_time, accepted_time)
{
    try
    {
        let pool = await sql.connect(config);
        let check = await pool.request().query(`SELECT * FROM orders WHERE order_id=${order_id}`);
        pool.close();
        console.log("Test Point 2");
        console.log(check.recordset);
        let c_id = check.recordset[0].u_id;
        console.log("Test Point 3")
        console.log(c_id)
        if (c_id === 1)
        {
            let pool2 = await sql.connect(config);
            let order = await pool2.request().query(`UPDATE ORDERS SET order_status='${order_status}', u_id=${chef_id}, est_time='${est_time}', accepted_time='${accepted_time}' WHERE order_id=${order_id}`);
            pool2.close();
            console.log("Test Point 4")
            console.log(order.recordset);
            let pool1 = await sql.connect(config);
            let final = await pool1.request().query(`SELECT * FROM ORDERS WHERE order_status='${order_status}' AND u_id=${chef_id} AND order_id=${order_id}`);
            console.log("Test Point 5")
            console.log(final.recordset);
            pool1.close();
            return final.recordset;
        }
        else
        {
            return [];
        }
    }
    catch (error)
    {
        console.log(error);
    }
}

async function changeOrderStatus (order_id, chef_id, order_status)
{
    try
    {
        let pool = await sql.connect(config);
        let order = await pool.request().query(`UPDATE ORDERS SET order_status='${order_status}', u_id=${chef_id} WHERE order_id=${order_id}`);
        pool.close();
        return order.recordset;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function changeTableStatus (table_id, table_status)
{
    try
    {
        let pool = await sql.connect(config);
        let order = await pool.request().query(`UPDATE tables SET table_status='${table_status}' WHERE table_id=${table_id}`);
        pool.close();
        return order.recordset;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getChefOrders (chef_id, order_status)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT * FROM ORDERS WHERE u_id = ${chef_id} AND order_status = '${order_status}'`);
        let result = orders.recordsets[0];
        pool.close();
        for (let each of result)
        {
            //console.log(each.order_id);
            //console.log(each.order_id);
            //console.log(each);
            let temp = await getOrderItems(each.order_id);
            each["items"] = temp;
            //console.log(temp);
            //console.log(each);
        }
        return orders.recordsets[0].reverse();
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
            //console.log("Hello");
            //console.log(item);

            let ind = await getItemsById(item.item_id);
            //console.log(ind);
            item["item_name"] = ind.item_name;
            //item["item_details"] = ind;
        }

        //console.log(oitems);
        //console.log(orders.recordsets[0]);
        
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

async function getUserById (id)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT * FROM USER_ WHERE u_id=${id}`);
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

async function CheckUname (uname)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT username FROM USER_ WHERE username = '${uname}' `);
        pool.close();
        //console.log(orders.recordsets);
        if (orders.recordsets[0].length > 0)
        {
            return true
        }
        else
        {
            return false
        }
    }
    catch (error)
    {
        console.log(error);
    }
}

async function CheckPhone (number)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT phone_no FROM USER_ WHERE phone_no = ${number}`);
        pool.close();
        if (orders.recordsets[0].length > 0)
        {
            return true
        }
        else
        {
            return false
        }
    }
    catch (error)
    {
        console.log(error);
    }
}

async function CheckNIC (nic)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT NIC FROM USER_ WHERE NIC = ${nic} `);
        pool.close();
        //console.log(orders.recordsets[0])
        if (orders.recordsets[0].length > 0)
        {
            return true
        }
        else
        {
            return false
        }
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
        return error;
    }
}

async function updateEmployee (id, u)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`UPDATE USER_ SET phone_no=${u.phone_no}, 
                    password='${u.password}', usertype='${u.usertype}', 
                    NIC=${u.NIC}, username='${u.username}', 
                    users_name='${u.users_name}' WHERE u_id=${id}`);
        pool.close();
        return orders.recordsets;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function authenticateUser (username, password, usertype)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT * FROM USER_ WHERE username = '${username}' AND password = '${password}' AND usertype = '${usertype}'`);
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
        return orders.recordsets[0];
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
        return orders.recordsets[0];
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
        let orders = await pool.request().query("SELECT * FROM inventory INNER JOIN inventory_category ON inventory.category_id=inventory_category.category_id");
        pool.close();
        return orders.recordsets[0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getInventoryById (id)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT * FROM inventory WHERE inventory_id=${id}`);
        pool.close();
        return orders.recordsets[0];
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
        return orders.recordsets[0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function addInventory (inventory)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`INSERT INTO inventory (inventory_name, date_of_purchase, cost, quantity, total_cost, category_id)
        VALUES ('${inventory.inventory_name}', '${inventory.date_of_purchase}', ${inventory.cost}, ${inventory.quantity}, 
                ${inventory.total_cost}, ${inventory.category_id})`);
        orders = await pool.request().query(`SELECT * FROM inventory WHERE inventory_name = '${inventory.inventory_name}'`);
        pool.close();
        return orders.recordsets[0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function updateInventory (id, i)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`UPDATE inventory SET inventory_name='${i.inventory_name}', 
                    date_of_purchase='${i.date_of_purchase}', cost=${i.cost}, 
                    quantity=${i.quantity}, total_cost=${i.total_cost}, 
                    category_id=${i.category_id} WHERE inventory_id=${id}`);
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
        return orders.recordsets[0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function CheckItemName (item_name)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT item_name FROM items WHERE item_name = '${item_name}' `);
        pool.close();
        //console.log(orders.recordsets[0])
        if (orders.recordsets[0].length > 0)
        {
            return true
        }
        else
        {
            return false
        }
    }
    catch (error)
    {
        console.log(error);
    }
}

async function CheckInventoryItemName (inventory_name)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT inventory_name FROM inventory WHERE inventory_name = '${inventory_name}' `);
        pool.close();
        //console.log(orders.recordsets[0])
        if (orders.recordsets[0].length > 0)
        {
            return true
        }
        else
        {
            return false
        }
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getItemCategoriesById (id)
{
    try
    {
        let result = []
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT * FROM item_category");
        orders = orders.recordsets[0];
        for (let i=0 ; i<orders.length ; i++)
        {
            let dummy = orders[i].f_category.split(',');
            //console.log(dummy);
            for (let cat of orders[i].f_category)
            {
                if (cat === id)
                {
                    //console.log(orders[i]);
                    result.push(orders[i]);
                    continue;
                }
            }
        }
        pool.close();
        //console.log(result)
        return result;
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
        return orders.recordsets[0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getAcceptedCount (u_id)
{
    try
    {
        let pool = await sql.connect(config);
        let chef_orders = await pool.request().query(`select COUNT(order_id) AS chef_count from orders where orders.u_id = ${u_id}`);
        let total_orders = await pool.request().query(`select COUNT(order_id) AS total_count from orders`);
        let result = {}
        result['chef_count'] = chef_orders.recordsets[0][0].chef_count;
        result['total_count'] = total_orders.recordsets[0][0].total_count;
        pool.close();
        return result;
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

async function getMenuById (id)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`SELECT * FROM items WHERE item_id = ${id} `);
        pool.close();
        return orders.recordset;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function updateMenu (id, m)
{
    console.log(m);

    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`UPDATE items SET item_name='${m.item_name}', 
                    item_price=${m.item_price}, item_description='${m.item_description}', 
                    menu_status='${m.menu_status}', image_id=${m.image_id}, 
                    category_id=${m.category_id}, icategory_id=${m.icategory_id}    
                    WHERE item_id=${id}`);
        pool.close();
        return orders.recordset;
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

async function addMenu (m)
{
    try
    {
        let pool = await sql.connect(config);
        let newProduct = await pool.request()
        .query(`INSERT INTO items (item_name, item_price, item_description, menu_status, image_id, category_id, icategory_id)
                VALUES ('${m.item_name}', ${m.item_price}, '${m.item_description}', '${m.menu_status}', ${m.image_id}, ${m.category_id}, ${m.icategory_id})`);
        pool.close();
        return newProduct.recordsets;
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
        pool.close();
        pool = await sql.connect(config);
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
        console.log('In procesOrder() addOrder() executed')

        console.log("Hello");

        for (let i=0; i<o.items.length; i++)
        {   
            let newProd = await addOrdersItems (id, o.items[i]);
        }

        console.log('In procesOrder() addOrderItems() executed')

        return id;
    }
    catch(error)
    {
        console.log(error);
    }
}

async function getBadReviews ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query("SELECT total_price, payment_mode, rating, table_id, users_name FROM ORDERS INNER JOIN USER_ ON ORDERS.U_id=USER_.u_id WHERE ORDERS.rating < 3");
        pool.close();
        return orders.recordsets[0];
    }
    catch (error)
    {
        console.log(error);
    }
}

async function setOrderRatingAndReview (order_id, rating, review)
{
    try
    {
        let pool = await sql.connect(config);
        let orders = await pool.request().query(`UPDATE orders SET rating = '${rating}', review = '${review}' where orders.order_id = ${order_id}`);
        pool.close();
        return orders;
    }
    catch (error)
    {
        console.log(error);
    }
}

async function getDashboardData ()
{
    try
    {
        let pool = await sql.connect(config);
        let orders_q = await pool.request().query(`SELECT COUNT(order_id) AS order_in_queue, (SELECT COUNT(*) FROM tables) AS total_tables FROM orders WHERE order_status IN ('assigned', 'n assg')`);
        orders_q = [orders_q.recordsets[0][0].order_in_queue, orders_q.recordsets[0][0].total_tables];
        console.log('CURRENT ORDERS INQUEUE: ', orders_q);
        let curr_mon_profit = await pool.request().query(`SELECT DATEPART(year, order_time) AS year, DATEPART(MONTH, order_time) AS month, SUM(total_price) AS money_earned FROM orders  WHERE order_status = 'ready' GROUP BY DATEPART(year, order_time), DATEPART(MONTH, order_time) ORDER BY year DESC, month DESC`);
        curr_mon_profit = curr_mon_profit.recordsets[0];
        let prev_mon_profit = curr_mon_profit[1];
        curr_mon_profit = curr_mon_profit[0];
        console.log('CURRENT MONTH SALES: ', curr_mon_profit);
        console.log('PREVIOUS MONTH SALES: ', prev_mon_profit);
        let curr_yr_profit = await pool.request().query(`SELECT DATEPART(year, order_time) AS year, SUM(total_price) AS money_earned FROM orders WHERE order_status='ready' GROUP BY DATEPART(year, order_time) ORDER BY year DESC`);
        curr_yr_profit = curr_yr_profit.recordsets[0];
        let prev_yr_profit = curr_yr_profit[1];
        curr_yr_profit = curr_yr_profit[0];
        console.log('CURRENT YEAR SALES: ', curr_yr_profit);
        console.log('PREVIOUS YEAR SALES: ', prev_yr_profit);
        let list1 = await pool.request().query(`SELECT orders.order_id, USER_.users_name, orders.rating, orders.review FROM orders INNER JOIN dbo.USER_ ON orders.u_id = USER_.u_id WHERE USER_.usertype <> 'admin' ORDER BY orders.order_id`);
        //console.log(orders.recordsets[0]);
        list1 = list1.recordsets[0];
        let list2 = await pool.request().query('SELECT orders_items.order_id, (SELECT items.item_name FROM items WHERE orders_items.item_id = items.item_id) AS dish_name FROM orders_items INNER JOIN orders ON orders_items.order_id = orders.order_id');
        //console.log(orders.recordsets[0]);
        list2 = list2.recordsets[0];
        let emp_count = await pool.request().query(`SELECT COUNT(u_id) AS emp_cnt FROM USER_ WHERE USER_.usertype <> 'admin'`);
        emp_count = emp_count.recordsets[0][0].emp_cnt;
        console.log('CURRENT EMPLOYEES: ', emp_count);
        let daily_profits = await pool.request().query(`SELECT SUM(total_price) AS daily_profs FROM orders WHERE order_status = 'ready' AND order_time = GETDATE()`);
        daily_profits = daily_profits.recordsets[0][0].daily_profs;
        //console.log('DAILY PROFITS: ', daily_profits);
        let yesterday_profits = await pool.request().query(`SELECT SUM(total_price) AS yesterday_profs FROM orders WHERE order_status = 'ready' AND order_time = GETDATE()-1`);
        yesterday_profits = yesterday_profits.recordsets[0][0].yesterday_profs;
        let total_sales = await pool.request().query(`SELECT SUM(total_price) AS total_prce FROM orders WHERE order_status = 'ready'`);
        total_sales = total_sales.recordsets[0][0].total_prce;
        //console.log('TOTAL SALES: ', total_sales);
        let last_10_days_profit = await pool.request().query(`SELECT DATEPART(YEAR, order_time) AS year, DATEPART(MONTH, order_time) AS month, DATEPART(DAY, order_time) AS day, SUM(total_price) AS money_earned FROM orders WHERE order_status = 'ready' AND order_time >= DATEADD(day,-10, GETDATE()) GROUP BY DATEPART(year, order_time), DATEPART(MONTH, order_time), DATEPART(DAY, order_time)`);
        last_10_days_profit = last_10_days_profit.recordsets[0];
        pool.close();
        if (yesterday_profits == null)
        {
            yesterday_profits = 0;
        }
        if (daily_profits == null)
        {
            daily_profits = 0;
        }
        console.log('DAILY PROFITS: ', daily_profits);
        if (total_sales == null)
        {
            total_sales = 0;
        }
        console.log('TOTAL SALES: ', total_sales);
        for (let i=0; i<list1.length; i++)
        {
            list1[i]['order_items'] = []
            for(let each of list2)
            {
                if (each.order_id === list1[i].order_id)
                {
                    list1[i].order_items.push(each.dish_name);
                }
            }
        }

        list1 = list1.reverse();
        let recent_orders = list1.splice(0,4);
        
        let bad_orders = []
        for (let ord of list1)
        {
            if (ord.rating < 3)
            {
                bad_orders.push(ord);
            }
        }

        if (bad_orders.length > 10)
        {
            bad_orders = bad_orders.splice(0, 10)
        }

        console.log('TABLE 2 CONTENTS: ', bad_orders);
        console.log('TABLE 1 CONTENTS: ', recent_orders);
        //return [orders_q, curr_mon_profit, curr_yr_profit, recent_orders, bad_orders, emp_count, [daily_profits, yesterday_profits], [total_sales, last_10_days_profit]];
        return [orders_q, [curr_mon_profit, prev_mon_profit], [curr_yr_profit, prev_yr_profit], recent_orders, bad_orders, emp_count, [daily_profits, yesterday_profits, last_10_days_profit], total_sales];
    }
    catch (error)
    {
        console.log(error);
    }
}

// async function setOrderReview (order_id, review)
// {
//     try
//     {
//         let pool = await sql.connect(config);
//         let orders = await pool.request().query(`UPDATE dbo.orders SET review = '${review}', where orders.order_id = ${order_id}`);
//         pool.close();
//         return orders;
//     }
//     catch (error)
//     {
//         console.log(error);
//     }
// }

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
    processOrder : processOrder,
    getChefOrders : getChefOrders,
    getAnOrder : getAnOrder,
    changeOrderStatus : changeOrderStatus,
    addInventory : addInventory,
    addMenu : addMenu,
    getMenuById : getMenuById,
    updateMenu : updateMenu,
    updateEmployee : updateEmployee,
    getInventoryById : getInventoryById,
    updateInventory : updateInventory,
    getItemsById : getItemsById,
    assignOrder : assignOrder,
    getBadReviews : getBadReviews,
    getUserById : getUserById,
    changeTableStatus : changeTableStatus,
    CheckUname : CheckUname,
    CheckPhone : CheckPhone,
    CheckNIC : CheckNIC,
    getItemCategoriesById : getItemCategoriesById,
    CheckItemName : CheckItemName,
    CheckInventoryItemName : CheckInventoryItemName,
    getAcceptedCount : getAcceptedCount,
    setOrderRatingAndReview : setOrderRatingAndReview,
    getDashboardData : getDashboardData,
}