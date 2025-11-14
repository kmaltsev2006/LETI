const { sequelize, BusType, SalaryRule, Driver, Bus, Issue, Route, WorkSchedule } = require('./schema');
const { Op } = require('sequelize');

const queries = {
    async query1() {
        return await BusType.findAll({ 
            limit: 10,
            order: [['capacity', 'DESC']]
        });
    },

    async query2() {
        return await SalaryRule.findAll({ 
            limit: 10,
            order: [['salary', 'DESC']]
        });
    },

    async query3() {
        return await Driver.findAll({ 
            limit: 10,
            order: [['experience', 'DESC']]
        });
    },

    async query4() {
        return await Bus.findAll({ 
            limit: 10,
            order: [['bus_type_id', 'ASC']]
        });
    },

    async query5() {
        return await Issue.findAll({ 
            limit: 10,
            order: [['bus_id', 'ASC']]
        });
    },

    async query6() {
        return await Route.findAll({ 
            limit: 10,
            order: [['number', 'ASC']]
        });
    },

    async query7() {
        return await WorkSchedule.findAll({ 
            limit: 10,
            order: [['work_date', 'DESC']]
        });
    },

    async query8() {
        return await Driver.findAll({
            include: [{
                model: WorkSchedule,
                where: { route_id: 10 }
            }],
            limit: 10,
            order: [['experience', 'DESC']]
        });
    },

    async query9() {
        return await Bus.findAll({
            include: [{
                model: WorkSchedule,
                where: { route_id: 10 }
            }],
            limit: 10,
            order: [['bus_type_id', 'ASC']]
        });
    },

    async query10() {
        return await Route.findAll({
            where: {
                [Op.or]: [
                    { start_point: 'Stadium' },
                    { end_point: 'Stadium' }
                ]
            },
            limit: 10,
            order: [['number', 'ASC']]
        });
    },

    async query11() {
        return await Route.findAll({
            attributes: ['number', 'start_time', 'end_time'],
            limit: 10,
            order: [['start_time', 'ASC']]
        });
    },

    async query12() {
        return await Route.findAll({
            attributes: ['number', 'travel_time'],
            limit: 10,
            order: [['travel_time', 'DESC']]
        });
    },

    async query13() {
        const result = await Route.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('travel_time')), 'total_travel_time']
            ]
        });
        return result[0].get('total_travel_time');
    },

    async query14() {
        return await WorkSchedule.findAll({
            include: [{
                model: Bus,
                include: [Issue]
            }],
            limit: 10,
            order: [['work_date', 'DESC']]
        });
    },

    async query15() {
        return await Driver.create({
            passport_data: 'AB1234581',
            worker_class: 1,
            experience: 0
        });
    },

    async query16() {
        return await Bus.destroy({
            where: { bus_id: 15 }
        });
    },

    async query17() {
        return await Route.create({
            number: 11,
            start_point: 'New Start',
            end_point: 'New End',
            start_time: '06:00:00',
            end_time: '22:00:00',
            movement_interval: '00:15:00',
            travel_time: '01:00:00'
        });
    },

    async query18() {
        return await Route.update({
            start_time: '07:00:00',
            end_time: '21:00:00'
        }, {
            where: { route_id: 3 }
        });
    },

    async query19() {
        return await Driver.update({
            experience: 3
        }, {
            where: { driver_id: 1 }
        });
    },

    async query20() {
        return await BusType.findAll({ 
            limit: 10,
            order: [['type_name', 'ASC']]
        });
    },

    async query21() {
        return await SalaryRule.findAll({ 
            limit: 10,
            order: [['worker_class', 'ASC']]
        });
    },

    async query22() {
        return await Driver.findAll({ 
            limit: 10,
            order: [['worker_class', 'ASC']]
        });
    },

    async query23() {
        return await Bus.findAll({ 
            limit: 10,
            order: [['registration_number', 'ASC']]
        });
    },

    async query24() {
        return await Issue.findAll({ 
            limit: 10,
            order: [['bus_id', 'ASC']]
        });
    },

    async query25() {
        return await Route.findAll({ 
            limit: 10,
            order: [['start_point', 'ASC']]
        });
    },

    async query26() {
        return await WorkSchedule.findAll({ 
            limit: 10,
            order: [['driver_id', 'ASC']]
        });
    }
};

async function testAllQueries() {
    try {
        await sequelize.authenticate();
        console.log("Connection successful");

        for (let i = 1; i <= 26; i++) {
            // if (i == 8 || i == 9) continue;
            console.time(`Query ${i}`);
            const result = await queries[`query${i}`]();
            console.timeEnd(`Query ${i}`);
            console.log(`Records: ${Array.isArray(result) ? result.length : 'N/A'}\n`);
        }

        console.log('All 26 queries completed successfully');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

testAllQueries();