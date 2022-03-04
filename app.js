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


router.route('/user').post(JsonParser, (req, res) =>
{
    //console.log(req.params.username);
    let u = {...req.body};

    dboperations.authenticateUser(u.username, u.password).then(result =>
    {
        //res.json(result[0].length);
        if (result[0].length === 1)
        {
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

router.route('/users').post(JsonParser, (request, res) => 
{
    let e = {...request.body};
    //console.log(f);

    dboperations.addEmployee(e).then( result => 
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
    //console.log(req.query.category);

    dboperations.getMenuItems(p.category).then(result => 
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

//PORT
/*
const port = process.env.PORT || 3000;
app.listen(port, '172.16.69.28', function()
{
    console.log(`Server Started on port ${port}...`);
});
*/

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', function()
{
    //console.log(`Server Started on port ${port}...`);
});
