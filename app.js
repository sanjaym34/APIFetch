const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const cookie = require('cookie-parser');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const { json } = require('express');
const ticket = require('./models/ticket')

mongoose.connect('mongodb://localhost:27017/APIFetch', {
    useNewUrlParser: true,  
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookie());


app.get('/', async (req, res) => {
    console.log("Home Page");
    const data = [];
    fetch('https://api.wazirx.com/api/v2/tickers')
        .then(res => res.json())
        .then(async json => {
            let count = 0;
            Object.entries(json).forEach(eachJson => {
                count++;
                if(count <= 10) {
                data.push(eachJson);
                }    
            })
            for(let i=0;i<10;i++){
                var newTicket = new ticket({
                    ticketName: data[i][0],
                    name: data[i][1].name,
                    last: data[i][1].last,
                    buy: data[i][1].buy,
                    sell: data[i][1].sell,
                    volume: data[i][1].volume,
                    base_unit: data[i][1].base_unit
                });
                newTicket.save();
                //console.log(newTicket);
            }
            var tickets = await ticket.find({});
            
            res.render('index',{tickets: tickets});
            //console.log(data);
        })
        //console.log(json)});
});

app.listen(3000, () => {
    console.log("Server on !!!!");
})