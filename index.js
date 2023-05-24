const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/member');
const eventRoutes = require('./routes/event');
const adminRoutes = require('./routes/admin');
const churchRoutes = require('./routes/church');
const baptismalRoutes = require('./routes/baptismal');
const attendanceRoutes = require('./routes/attendance');
const tithesRoutes = require('./routes/tithes');
const offeringRoutes = require('./routes/offering');
const pledgeRoutes = require('./routes/pledges');
const expensesRoutes = require('./routes/expenses');
const financeRoutes = require('./routes/finance');
const otpRoutes = require('./routes/otp');

const app = express();

const ports = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization,');
    next();
});


app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/apis/auth', authRoutes);
app.use('/apis/member', memberRoutes);
app.use('/apis/event', eventRoutes);
app.use('/apis/admin/auth', adminRoutes);
app.use('/apis/church', churchRoutes);
app.use('/apis/baptismal', baptismalRoutes);
app.use('/apis/attendance', attendanceRoutes);
app.use('/apis/tithes', tithesRoutes);
app.use('/apis/offering', offeringRoutes);
app.use('/apis/pledge', pledgeRoutes);
app.use('/apis/expenses', expensesRoutes);
app.use('/apis/finance', financeRoutes);
app.use('/apis/otp', otpRoutes);

app.use('/* ', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend/index.html'))
})

app.listen(ports, () =>{
    console.log(`Listening on port ${ports}`);
});

