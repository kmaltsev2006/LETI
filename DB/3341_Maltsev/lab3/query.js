const { sequelize, BusType, SalaryRule, Driver, Bus, Issue, Route, WorkSchedule } = require('./schema');
const { Op } = require('sequelize');

const queries = {
    // 1: SELECT * FROM BusType;
    async query1() {
        return await BusType.findAll();
    },

    // 2: SELECT * FROM SalaryRule;
    async query2() {
        return await SalaryRule.findAll();
    },

    // 3: SELECT * FROM Driver;
    async query3() {
        return await Driver.findAll();
    },

    // 4: SELECT * FROM Bus;
    async query4() {
        return await Bus.findAll();
    },

    // 5: SELECT * FROM Issue;
    async query5() {
        return await Issue.findAll();
    },

    // 6: SELECT * FROM Route;
    async query6() {
        return await Route.findAll();
    },

    // 7: SELECT * FROM WorkSchedule;
    async query7() {
        return await WorkSchedule.findAll();
    },

    // 8: SELECT D.*, W.* FROM Driver AS D JOIN WorkSchedule AS W ON D.driver_id = W.driver_id WHERE W.route_id = 10;
    async query8() {
        return await Driver.findAll({
            include: [{
                model: WorkSchedule,
                where: { route_id: 10 }
            }]
        });
    },

    // 9: SELECT B.*, W.* FROM Bus as B JOIN WorkSchedule AS W ON B.bus_id = W.bus_id WHERE W.route_id = 10;
    async query9() {
        return await Bus.findAll({
            include: [{
                model: WorkSchedule,
                where: { route_id: 10 }
            }]
        });
    },

    // 10: SELECT * FROM Route as R WHERE (R.start_point = 'Stadium' or R.end_point = 'Stadium');
    async query10() {
        return await Route.findAll({
            where: {
                [Op.or]: [
                    { start_point: 'Stadium' },
                    { end_point: 'Stadium' }
                ]
            }
        });
    },

    // 11: SELECT number, start_time, end_time FROM Route;
    async query11() {
        return await Route.findAll({
            attributes: ['number', 'start_time', 'end_time']
        });
    },

    // 12: SELECT number, travel_time FROM Route;
    async query12() {
        return await Route.findAll({
            attributes: ['number', 'travel_time']
        });
    },

    // 13: SELECT SUM(travel_time) FROM Route;
    async query13() {
        const result = await Route.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('travel_time')), 'total_travel_time']
            ]
        });
        return result[0].get('total_travel_time');
    },

    // 14: SELECT W.*, I.* FROM WorkSchedule as W JOIN Issue as I ON W.bus_id = I.bus_id;
    async query14() {
        return await WorkSchedule.findAll({
            include: [{
                model: Bus,
                include: [Issue] // Include Issue through Bus
            }]
        });
    },


    // 15: INSERT INTO Driver (passport_data, worker_class, experience) VALUES ('AB1234581', 1, 0);
    async query15() {
        return await Driver.create({
            passport_data: 'AB1234581',
            worker_class: 1,
            experience: 0
        });
    },

    // 16: DELETE FROM Bus WHERE bus_id = 15;
    async query16() {
        return await Bus.destroy({
            where: { bus_id: 15 }
        });
    },

    // 17: INSERT INTO Route (number, start_point, end_point, start_time, end_time, movement_interval, travel_time) VALUES (11, 'New Start', 'New End', '06:00:00', '22:00:00', '00:15:00', '01:00:00');
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

    // 18: UPDATE Route SET start_time = '07:00:00', end_time = '21:00:00' WHERE route_id = 3;
    async query18() {
        return await Route.update({
            start_time: '07:00:00',
            end_time: '21:00:00'
        }, {
            where: { route_id: 3 }
        });
    },

    // 19: UPDATE Driver SET experience = 3 WHERE driver_id = 1;
    async query19() {
        return await Driver.update({
            experience: 3
        }, {
            where: { driver_id: 1 }
        });
    },

    // 20: SELECT * FROM BusType;
    async query20() {
        return await BusType.findAll();
    },

    // 21: SELECT * FROM SalaryRule;
    async query21() {
        return await SalaryRule.findAll();
    },

    // 22: SELECT * FROM Driver;
    async query22() {
        return await Driver.findAll();
    },

    // 23: SELECT * FROM Bus;
    async query23() {
        return await Bus.findAll();
    },

    // 24: SELECT * FROM Issue;
    async query24() {
        return await Issue.findAll();
    },

    // 25: SELECT * FROM Route;
    async query25() {
        return await Route.findAll();
    },

    // 26: SELECT * FROM WorkSchedule;
    async query26() {
        return await WorkSchedule.findAll();
    }
};

async function testAllQueries() {
    try {
        await sequelize.authenticate();
        console.log("Connection successful");

        // 1
        console.log('Query 1 - BusTypes:', (await queries.query1()).length);
        // 2
        console.log('Query 2 - SalaryRules:', (await queries.query2()).length);
        // 3
        console.log('Query 3 - Drivers:', (await queries.query3()).length);
        // 4
        console.log('Query 4 - Buses:', (await queries.query4()).length);
        // 5
        console.log('Query 5 - Issues:', (await queries.query5()).length);
        // 6
        console.log('Query 6 - Routes:', (await queries.query6()).length);
        // 7
        console.log('Query 7 - WorkSchedules:', (await queries.query7()).length);
        // 8
        console.log('Query 8 - Drivers on route 10:', (await queries.query8()).length);
        // 9
        console.log('Query 9 - Buses on route 10:', (await queries.query9()).length);
        // 10
        console.log('Query 10 - Routes through Stadium:', (await queries.query10()).length);
        // 11
        console.log('Query 11 - Route times:', (await queries.query11()).length);
        // 12
        console.log('Query 12 - Route travel times:', (await queries.query12()).length);
        // 13
        console.log('Query 13 - Total travel time:', await queries.query13());
        // 14
        console.log('Query 14 - Buses with issues:', (await queries.query14()).length);
        // 15
        const newDriver = await queries.query15();
        console.log('Query 15 - Added driver ID:', newDriver.driver_id);
        // 16
        const deletedBuses = await queries.query16();
        console.log('Query 16 - Deleted buses:', deletedBuses);
        // 17
        const newRoute = await queries.query17();
        console.log('Query 17 - Added route ID:', newRoute.route_id);
        // 18
        const updatedRoutes = await queries.query18();
        console.log('Query 18 - Updated routes:', updatedRoutes[0]);
        // 19
        const updatedDrivers = await queries.query19();
        console.log('Query 19 - Updated drivers:', updatedDrivers[0]);
        // 20
        console.log('Query 20 - BusTypes:', (await queries.query20()).length);
        // 21
        console.log('Query 21 - SalaryRules:', (await queries.query21()).length);
        // 22
        console.log('Query 22 - Drivers:', (await queries.query22()).length);
        // 23
        console.log('Query 23 - Buses:', (await queries.query23()).length);
        // 24
        console.log('Query 24 - Issues:', (await queries.query24()).length);
        // 25
        console.log('Query 25 - Routes:', (await queries.query25()).length);
        // 26
        console.log('Query 26 - WorkSchedules:', (await queries.query26()).length);

        console.log('All 26 queries completed successfully');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

testAllQueries();
