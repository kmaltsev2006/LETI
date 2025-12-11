const express = require('express');
const { sequelize } = require('./schema');
const { queries } = require('./query');

const app = express();

// Safe queries
app.get('/query/:id', async (req, res) => {
    const result = await queries[`query${req.params.id}`]();
    res.json(result);
});

// SQL injection vulnerable
app.get('/unsafe/drivers', async (req, res) => {
    const result = await sequelize.query(`SELECT * FROM "Driver" WHERE experience = ${req.query.exp} LIMIT 10`);
    res.json(result[0]);
});

app.get('/unsafe/routes', async (req, res) => {
    const result = await sequelize.query(`SELECT * FROM "Route" WHERE start_point LIKE '%${req.query.search}%' LIMIT 10`);
    res.json(result[0]);
});

app.get('/unsafe/schedule', async (req, res) => {
    const result = await sequelize.query(`SELECT * FROM "WorkSchedule" ORDER BY ${req.query.order} LIMIT 10`);
    res.json(result[0]);
});

app.listen(3000);