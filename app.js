const express = require('express');
const app = express();
const router = express.Router();

const bodyParser = require('body-parser');
var cors = require('cors');

app.use(bodyParser.urlencoded(
    {
        extended:true
    }
));
app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use('/api', router);

var module = require('./modules');
const dboperations = require('./dboperations');
const { route } = require('express/lib/application');

var JsonParser = bodyParser.json();

//middleware
router.use((req, res, next) =>
{
    //console.log("This is a middleware");
    next();
});

router.route('/users').get((req, res) =>
{
    dboperations.getEmployees().then(result => 
    {
        if (result.length > 0)
        {
            res.status(200).send(result);
        }
        else
        {
            res.status(404).send("Not Found");
        }
    });
});

router.route('/user').post(JsonParser, (req, res) =>
{
    //console.log(req.params.username);
    let u = {...req.body};
    //console.log(u);

    dboperations.authenticateUser(u.username, u.password, u.usertype).then(result =>
    {
        //res.json(result[0].length);
        if (result[0].length === 1)
        {
            //console.log("Hello");
            res.status(200).json(result[0]);
        }
        else if (result[0].length > 1)
        {
            res.status(400).json("Bad Request");
        }
        else
        {
            res.status(403).send("Forbidden");
        }
    })
});

router.route('/user/:id').get(JsonParser, (request, res) => 
{
    dboperations.getUserById(request.params.id).then( result => 
    {
        res.status(200).json(result);
    });
});

router.route('/users').post(JsonParser, (request, res) => 
{
    let e = {...request.body};
    //console.log(f);

    dboperations.addEmployee(e).then( result => 
    {
        res.status(201).json(result);
    });
});

router.route('/users/:id').put(JsonParser, (request, res) => 
{
    let u = {...request.body};
    //console.log(u);

    dboperations.updateEmployee(request.params.id, u).then( result => 
    {
        res.status(201).json(result);
    });
});

router.route('/menu').get(JsonParser, (req, res) =>
{
    //let p = {...req.body};
    let p = {...req.query};
    //let y = {...req.query.params.category}
    //console.log(p);
    console.log(req.query.category);

    dboperations.getMenuItems(p.category).then(result => 
    {
        res.status(200).send(result);
    });
});

router.route('/menu/:id').get(JsonParser, (req, res) =>
{
    dboperations.getMenuById(req.params.id).then(result => 
    {
        res.status(200).send(result);
    });
});

router.route('/menu/:id').put(JsonParser, (req, res) =>
{
    let m = {...req.body};

    dboperations.updateMenu(req.params.id, m).then(result => 
    {
        res.status(200).send(result);
    });
});

router.route('/menu').post(JsonParser, (req, res) =>
{
    //FIRST FETCH CATEGORY API
    //THEN FETCH ITEM CATEGORY API

    let m = {...req.body};

    console.log(m);

    dboperations.addMenu(m).then(result => 
    {
        res.status(200).send(result);
    });
});

router.route('/amenu').get(JsonParser, (req, res) =>
{
    dboperations.getItems().then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/items/:id').get(JsonParser, (req, res) =>
{
    dboperations.getItemsById(req.params.id).then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/orders').get(JsonParser, (req, res) =>
{
    dboperations.getOrders().then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/order/:id'). get(JsonParser, (req, res) =>
{
    dboperations.getOrderItems(req.params.id).then( result =>
    {
        res.status(200).send(result);        
    });
});

router.route('/order').post(JsonParser, (req, res) =>
{
    let o = {...req.body};
    console.log(o);

    dboperations.processOrder(o).then(result => 
    {
        res.status(200).send(result.toString());
    });
});

router.route('/cheforders').get(JsonParser, (req, res) =>
{
    let o = {...req.query};

    console.log(o);
    dboperations.getChefOrders(o.chef_id, o.order_status).then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/lookfororder').get(JsonParser, (req, res) =>
{
    dboperations.getAnOrder().then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/assignorder').get(JsonParser, (req, res) =>
{
    let o = {...req.query};

    console.log("Test point 1")
    console.log(o);

    dboperations.assignOrder(o.order_id, o.chef_id, o.order_status, o.est_time, o.accepted_time).then(result =>
    {
        console.log("Test Point 6");
        console.log(result);
        if (result.length === 1)
        {
            res.status(200).send(result);
        }
        else
        {
            res.status(304).send('Hello');
        }
    });
});

router.route('/changeorderstatus').get(JsonParser, (req, res) =>
{
    let o = {...req.query};

    console.log(o)
    dboperations.changeOrderStatus(o.order_id, o.chef_id, o.order_status).then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/changetablestatus').get(JsonParser, (req, res) =>
{
    let t = {...req.query};

    console.log(t)
    dboperations.changeTableStatus(t.table_id, t.table_status).then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/inventory').get(JsonParser, (req, res) =>
{
    dboperations.getInventories().then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/inventory/:id').get(JsonParser, (req, res) =>
{

    console.log("HEllo");
    dboperations.getInventoryById(req.params.id).then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/inventory').post(JsonParser, (req, res) =>
{
    //FIRST FETCH INVENTOY CATEGORIES

    let i = {...req.body};

    //console.log(i);

    dboperations.addInventory(i).then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/inventory/:id').put(JsonParser, (req, res) =>
{
    let i = {...req.body}

    dboperations.updateInventory(req.params.id, i).then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/icategory').get(JsonParser, (req, res) =>
{
    dboperations.getInventoryCategories().then(result =>
    {
        res.status(200).send(result);
    });
});

router.route('/tables').get(JsonParser, (req, res) =>
{
    dboperations.getTables().then( result =>
    {
        res.status(200).send(result);
    });
});

router.route('/image/:id').get( (req, res) =>
{
    dboperations.getImagesById(req.params.id).then(result => 
    {
        res.status(200).send(result[0][0].pic_path);
    });
});

router.route('/badreviews').get(JsonParser, (req, res) =>
{
    dboperations.getBadReviews().then( result =>
    {
        res.status(200).send(result);
    });
});

router.route('/foodcategories').get(JsonParser, (req, res) =>
{
    dboperations.getFoodCategories().then( result =>
    {
        res.status(200).send(result);
    });
});

router.route('/itemcategories').get(JsonParser, (req, res) =>
{
    dboperations.getItemCategories().then( result =>
    {
        res.status(200).send(result);
    });
});

//PORT

const port = process.env.PORT || 3000;
app.listen(port, '192.168.10.4', function()
{
    console.log(`Server Started on port ${port}...`);
});


// const port = process.env.PORT || 3000;
// app.listen(port, '0.0.0.0', function()
// {
//     //console.log(`Server Started on port ${port}...`);
// });
