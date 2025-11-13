const { sequelize, BusType, SalaryRule, Driver, Bus, Issue, Route, WorkSchedule } = require('./schema.js');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });

        // BusType data
        await BusType.bulkCreate([
            { type_name: 'Standard Bus', capacity: 50 },
            { type_name: 'Double Decker', capacity: 80 },
            { type_name: 'Mini Bus', capacity: 20 }
        ]);

        // SalaryRule data
        await SalaryRule.bulkCreate([
            { worker_class: 1, experience_from: 0, salary: 25000 },
            { worker_class: 2, experience_from: 0, salary: 40000 },
            { worker_class: 3, experience_from: 0, salary: 55000 },
            { worker_class: 1, experience_from: 3, salary: 30000 },
            { worker_class: 2, experience_from: 3, salary: 45000 },
            { worker_class: 3, experience_from: 3, salary: 60000 },
            { worker_class: 1, experience_from: 6, salary: 35000 },
            { worker_class: 2, experience_from: 6, salary: 50000 },
            { worker_class: 3, experience_from: 6, salary: 65000 }
        ]);

        // Driver data
        await Driver.bulkCreate([
            { passport_data: 'AB1234561', worker_class: 1, experience: 1 },
            { passport_data: 'AB1234562', worker_class: 1, experience: 2 },
            { passport_data: 'AB1234563', worker_class: 1, experience: 3 },
            { passport_data: 'AB1234564', worker_class: 1, experience: 4 },
            { passport_data: 'AB1234565', worker_class: 1, experience: 5 },
            { passport_data: 'AB1234566', worker_class: 2, experience: 1 },
            { passport_data: 'AB1234567', worker_class: 2, experience: 2 },
            { passport_data: 'AB1234568', worker_class: 2, experience: 3 },
            { passport_data: 'AB1234569', worker_class: 2, experience: 4 },
            { passport_data: 'AB1234570', worker_class: 2, experience: 5 },
            { passport_data: 'AB1234571', worker_class: 2, experience: 6 },
            { passport_data: 'AB1234572', worker_class: 1, experience: 1 },
            { passport_data: 'AB1234573', worker_class: 1, experience: 2 },
            { passport_data: 'AB1234574', worker_class: 1, experience: 3 },
            { passport_data: 'AB1234575', worker_class: 1, experience: 4 },
            { passport_data: 'AB1234576', worker_class: 2, experience: 1 },
            { passport_data: 'AB1234577', worker_class: 2, experience: 2 },
            { passport_data: 'AB1234578', worker_class: 2, experience: 3 },
            { passport_data: 'AB1234579', worker_class: 2, experience: 4 },
            { passport_data: 'AB1234580', worker_class: 2, experience: 5 }
        ]);

        // Bus data
        await Bus.bulkCreate([
            { bus_type_id: 1, registration_number: 'AB1001' },
            { bus_type_id: 1, registration_number: 'AB1002' },
            { bus_type_id: 1, registration_number: 'AB1003' },
            { bus_type_id: 1, registration_number: 'AB1004' },
            { bus_type_id: 1, registration_number: 'AB1005' },
            { bus_type_id: 1, registration_number: 'AB1006' },
            { bus_type_id: 1, registration_number: 'AB1007' },
            { bus_type_id: 1, registration_number: 'AB1008' },
            { bus_type_id: 1, registration_number: 'AB1009' },
            { bus_type_id: 1, registration_number: 'AB1010' },
            { bus_type_id: 2, registration_number: 'CD2001' },
            { bus_type_id: 2, registration_number: 'CD2002' },
            { bus_type_id: 2, registration_number: 'CD2003' },
            { bus_type_id: 2, registration_number: 'CD2004' },
            { bus_type_id: 2, registration_number: 'CD2005' },
            { bus_type_id: 2, registration_number: 'CD2006' },
            { bus_type_id: 2, registration_number: 'CD2007' },
            { bus_type_id: 2, registration_number: 'CD2008' },
            { bus_type_id: 2, registration_number: 'CD2009' },
            { bus_type_id: 2, registration_number: 'CD2010' },
            { bus_type_id: 3, registration_number: 'EF3001' },
            { bus_type_id: 3, registration_number: 'EF3002' },
            { bus_type_id: 3, registration_number: 'EF3003' },
            { bus_type_id: 3, registration_number: 'EF3004' },
            { bus_type_id: 3, registration_number: 'EF3005' },
            { bus_type_id: 3, registration_number: 'EF3006' },
            { bus_type_id: 3, registration_number: 'EF3007' },
            { bus_type_id: 3, registration_number: 'EF3008' },
            { bus_type_id: 3, registration_number: 'EF3009' },
            { bus_type_id: 3, registration_number: 'EF3010' }
        ]);

        // Issue data
        await Issue.bulkCreate([
            { bus_id: 1, reason: 'Engine failure' },
            { bus_id: 5, reason: 'Flat tire' },
            { bus_id: 12, reason: 'Broken door' },
            { bus_id: 22, reason: 'Battery issues' },
            { bus_id: 30, reason: 'Regular maintenance' }
        ]);

        // Route data
        await Route.bulkCreate([
            { number: 1, start_point: 'Central Station', end_point: 'Airport', start_time: '06:00:00', end_time: '22:00:00', movement_interval: '00:15:00', travel_time: '01:00:00' },
            { number: 2, start_point: 'Downtown', end_point: 'Stadium', start_time: '07:00:00', end_time: '20:00:00', movement_interval: '00:10:00', travel_time: '00:45:00' },
            { number: 3, start_point: 'Suburb', end_point: 'Mall', start_time: '05:30:00', end_time: '23:00:00', movement_interval: '00:20:00', travel_time: '01:15:00' },
            { number: 4, start_point: 'East Park', end_point: 'West End', start_time: '06:30:00', end_time: '21:30:00', movement_interval: '00:12:00', travel_time: '00:50:00' },
            { number: 5, start_point: 'North Square', end_point: 'South Market', start_time: '06:00:00', end_time: '22:30:00', movement_interval: '00:18:00', travel_time: '01:05:00' },
            { number: 6, start_point: 'Museum', end_point: 'Library', start_time: '08:00:00', end_time: '20:00:00', movement_interval: '00:20:00', travel_time: '00:40:00' },
            { number: 7, start_point: 'Hospital', end_point: 'City Hall', start_time: '06:15:00', end_time: '22:00:00', movement_interval: '00:15:00', travel_time: '00:55:00' },
            { number: 8, start_point: 'Stadium', end_point: 'Central Park', start_time: '07:00:00', end_time: '21:00:00', movement_interval: '00:10:00', travel_time: '00:35:00' },
            { number: 9, start_point: 'Old Town', end_point: 'New Town', start_time: '06:00:00', end_time: '22:00:00', movement_interval: '00:15:00', travel_time: '01:10:00' },
            { number: 10, start_point: 'West Station', end_point: 'East Station', start_time: '05:45:00', end_time: '23:00:00', movement_interval: '00:25:00', travel_time: '01:20:00' }
        ]);

        // WorkSchedule data
        await WorkSchedule.bulkCreate([
            { driver_id: 1, bus_id: 1, route_id: 1, work_date: '2025-10-20' },
            { driver_id: 2, bus_id: 2, route_id: 1, work_date: '2025-10-20' },
            { driver_id: 3, bus_id: 3, route_id: 2, work_date: '2025-10-20' },
            { driver_id: 4, bus_id: 4, route_id: 3, work_date: '2025-10-20' },
            { driver_id: 5, bus_id: 5, route_id: 4, work_date: '2025-10-20' },
            { driver_id: 6, bus_id: 6, route_id: 5, work_date: '2025-10-20' },
            { driver_id: 7, bus_id: 7, route_id: 6, work_date: '2025-10-20' },
            { driver_id: 8, bus_id: 8, route_id: 7, work_date: '2025-10-20' },
            { driver_id: 9, bus_id: 9, route_id: 8, work_date: '2025-10-20' },
            { driver_id: 10, bus_id: 10, route_id: 9, work_date: '2025-10-20' },
            { driver_id: 11, bus_id: 11, route_id: 10, work_date: '2025-10-20' },
            { driver_id: 12, bus_id: 12, route_id: 1, work_date: '2025-10-20' },
            { driver_id: 13, bus_id: 13, route_id: 2, work_date: '2025-10-20' },
            { driver_id: 14, bus_id: 14, route_id: 3, work_date: '2025-10-20' },
            { driver_id: 15, bus_id: 15, route_id: 4, work_date: '2025-10-20' },
            { driver_id: 16, bus_id: 16, route_id: 5, work_date: '2025-10-20' },
            { driver_id: 17, bus_id: 17, route_id: 6, work_date: '2025-10-20' },
            { driver_id: 18, bus_id: 18, route_id: 7, work_date: '2025-10-20' },
            { driver_id: 19, bus_id: 19, route_id: 8, work_date: '2025-10-20' },
            { driver_id: 20, bus_id: 20, route_id: 9, work_date: '2025-10-20' },
            { driver_id: 1, bus_id: 21, route_id: 10, work_date: '2025-10-21' },
            { driver_id: 2, bus_id: 22, route_id: 1, work_date: '2025-10-21' },
            { driver_id: 3, bus_id: 23, route_id: 2, work_date: '2025-10-21' },
            { driver_id: 4, bus_id: 24, route_id: 3, work_date: '2025-10-21' },
            { driver_id: 5, bus_id: 25, route_id: 4, work_date: '2025-10-21' },
            { driver_id: 6, bus_id: 26, route_id: 5, work_date: '2025-10-21' },
            { driver_id: 7, bus_id: 27, route_id: 6, work_date: '2025-10-21' },
            { driver_id: 8, bus_id: 28, route_id: 7, work_date: '2025-10-21' },
            { driver_id: 9, bus_id: 29, route_id: 8, work_date: '2025-10-21' },
            { driver_id: 10, bus_id: 30, route_id: 9, work_date: '2025-10-21' }
        ]);

        console.log('Database seeded successfully');
    } catch (err) {
        console.log('Error seeding database:', err);
    }
};

seedDatabase();

