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

const http = require('http');
const socket = http.createServer(app);

let ws = require('ws');
const server = new ws.WebSocketServer({ port:3000 });

var JsonParser = bodyParser.json();

//middleware
router.use((req, res, next) =>
{
    //console.log("This is a middleware");
    next();
});

let users = [];
let curr_sock = [];

server.on("connection", (socket) => {
    //console.log('A new user connected');

    //console.log(socket);

    socket.on("message", (data) => {
        const packet = JSON.parse(data);

        switch (packet.type) {

        case "completion message":
            console.log('This is a completion message')
            users.map( (user) =>
            {
                if(user.author[0] === 'table' && user.author[1] === packet.content[1])
                {
                    //console.log(user[2]);
                    user.author[2].send(JSON.stringify({
                        type: "completion message"
                        //content: [packet.content[2]]
                    }));
                }
            });
            break;

        case "timer message":
            console.log('This is a timer message')
            users.map( (user) =>
            {
                if(user.author[0] === 'table' && user.author[1] === packet.content[1])
                {
                    user.author[2].send(JSON.stringify({
                        type: "timer",
                        content: [packet.content[2]]
                    }));
                }
            });
            break;

        case "connection buildup":
            let flag = true
            console.log('A user tried to connect');
            users.map( (user) =>
            {
                if (user.author[0] === packet.content[0] && user.author[1] === packet.content[1] && flag === true)
                {
                    console.log('An already existing user connected');
                    console.log(packet.content[0] + ' ' + packet.content[1]);
                    //users.push({ 'author' : [packet.content[0], packet.content[1], socket] });
                    user.author[2] = socket;
                    flag = false
                }
            });

            if (flag)
            {
                console.log('A new user connected');
                console.log(packet.content[0] + ' ' + packet.content[1]);
                users.push({ 'author' : [packet.content[0], packet.content[1], socket] });
            }

            console.log('current users : ' + users);
        }
    });
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

router.route('/verifyuname').get(JsonParser, (request, res) => 
{
    let e = {...request.query};
    //console.log(e);

    dboperations.CheckUname(e.uname).then( result => 
    {
        if (result == true)
        {
            res.status(200).json(result);
        }
        else
        {
            res.status(400).json(result)
        }
    });
});

router.route('/verifynumber').get(JsonParser, (request, res) => 
{
    let e = {...request.query};
    //console.log(f);

    dboperations.CheckPhone(e.number).then( result => 
    {
        if (result == true)
        {
            res.status(200).json(result);
        }
        else
        {
            res.status(400).json(result)
        }
    });
});

router.route('/verifynic').get(JsonParser, (request, res) => 
{
    let e = {...request.query};
    //console.log(e);

    dboperations.CheckNIC(e.nic).then( result => 
    {
        if (result == true)
        {
            res.status(200).json(result);
        }
        else
        {
            res.status(400).json(result)
        }
    });
});

router.route('/users').post(JsonParser, (request, res) => 
{
    let e = {...request.body};
    //console.log(f);

    dboperations.addEmployee(e).then( result => 
    {
        if (result.length == 1)
        {
            res.status(201).json(result.length);
        }
        else
        {
            res.status(412).json(result)
        }
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
        console.log('CheckPoint: ', result);
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

router.route('/setratingandreview').post(JsonParser, (req, res) =>
{
    let i = {...req.body}
    console.log(i)

    dboperations.setOrderRatingAndReview( i.order_id, i.rating, i.review ).then(result =>
    {
      //res.status(201).send(result);
      if (result.rowsAffected[0] == 1)
      {
        res.status(201).send(result);
      }
      else
      {
        res.status(400).send(result);
      }
    });
});

// router.route('/setreview').post(JsonParser, (req, res) =>
// {
//     let i = {...req.body}

//     dboperations.setOrderReview( i.order_id, i.review).then(result =>
//     {
//       //res.status(201).send(result);
//       if (result.rowsAffected[0] == 1)
//       {
//         res.status(201).send(result);
//       }
//       else
//       {
//         res.status(400).send(result);
//       }
//     });
// });

router.route('/inventory').post(JsonParser, (req, res) =>
{
    //FIRST FETCH INVENTOY CATEGORIES

    let i = {...req.body};

    //console.log(i);

    dboperations.addInventory(i).then(result =>
    {
        //console.log(result)
        if (result.length === 1)
        {
            res.status(200).send(result);
        }
        else
        {
            res.status(400).send("Error");
        }
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

router.route('/itemcategories/:id').get(JsonParser, (req, res) =>
{
    dboperations.getItemCategoriesById(req.params.id).then( result =>
    {
        res.status(200).send(result);
    });
});

router.route('/verifyitemname').get(JsonParser, (request, res) => 
{
    let e = {...request.query};
    //console.log(e);

    dboperations.CheckItemName(e.i_name).then( result => 
    {
        if (result == true)
        {
            res.status(200).json(result);
        }
        else
        {
            res.status(400).json(result)
        }
    });
});

router.route('/verifyinventoryname').get(JsonParser, (request, res) => 
{
    let e = {...request.query};
    //console.log(e);

    dboperations.CheckInventoryItemName(e.inv_name).then( result => 
    {
        if (result == true)
        {
            res.status(200).json(result);
        }
        else
        {
            res.status(400).json(result)
        }
    });
});

router.route('/getacceptedcount').get(JsonParser, (request, res) => 
{
    let e = {...request.query};
    //console.log(e);

    dboperations.getAcceptedCount(e.u_id).then( result => 
    {
        res.status(200).json(result)
    });
});

router.route('/dashboardapi').get(JsonParser, (request, res) => 
{
    dboperations.getDashboardData().then( result => 
    {
        res.status(200).json(result)
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
