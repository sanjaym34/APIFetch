const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    ticketName: String,
    name: String,
    last: String,
    buy: String,
    sell: String,
    volume: String,
    base_unit: String
})

module.exports = mongoose.model('Ticket', TicketSchema);