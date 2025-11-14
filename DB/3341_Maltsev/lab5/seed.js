const { sequelize, BusType, SalaryRule, Driver, Bus, Issue, Route, WorkSchedule } = require('./schema.js');
const { faker } = require('@faker-js/faker');


const RECORD_COUNT = 100000;

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log(`Seeding database with ${RECORD_COUNT} records per table...`);

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
        const drivers = [];
        for (let i = 0; i < RECORD_COUNT; i++) {
            drivers.push({
                passport_data: faker.string.alphanumeric(10).toUpperCase(),
                worker_class: faker.number.int({ min: 1, max: 3 }),
                experience: faker.number.int({ min: 0, max: 20 })
            });
        }
        await Driver.bulkCreate(drivers);
        console.log(`Created ${drivers.length} drivers`);

        // Bus data
        const buses = [];
        const registrationPrefixes = ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST'];
        
        for (let i = 0; i < RECORD_COUNT; i++) {
            buses.push({
                bus_type_id: faker.number.int({ min: 1, max: 3 }),
                registration_number: `${faker.helpers.arrayElement(registrationPrefixes)}${faker.string.numeric(4)}`
            });
        }
        await Bus.bulkCreate(buses);
        console.log(`Created ${buses.length} buses`);

        // Issue data
        const issues = [];
        const issueReasons = [
            'Engine failure',
            'Flat tire',
            'Broken door',
            'Battery issues',
            'Regular maintenance',
            'Brake system problems',
            'Transmission issues',
            'Electrical system failure',
            'Air conditioning problems',
            'Suspension issues'
        ];

        const issueCount = Math.floor(RECORD_COUNT * 0.3);
        const busIdsWithIssues = faker.helpers.arrayElements(
            Array.from({ length: RECORD_COUNT }, (_, i) => i + 1), 
            issueCount
        );

        for (const busId of busIdsWithIssues) {
            issues.push({
                bus_id: busId,
                reason: faker.helpers.arrayElement(issueReasons),
                description: faker.lorem.sentence(),
                reported_date: faker.date.recent({ days: 30 })
            });
        }
        await Issue.bulkCreate(issues);
        console.log(`Created ${issues.length} issues`);

        // Route data
        const routes = [];
        const locations = [
            'Central Station', 'Airport', 'Downtown', 'Stadium', 'Suburb', 'Shopping Mall',
            'East Park', 'West End', 'North Square', 'South Market', 'City Museum',
            'Public Library', 'General Hospital', 'City Hall', 'Central Park', 'Old Town',
            'New Town', 'West Station', 'East Station', 'University', 'Business District',
            'Residential Area', 'Industrial Zone', 'Tourist Center', 'Sports Complex'
        ];

        for (let i = 0; i < RECORD_COUNT; i++) {
            let startPoint, endPoint;
            do {
                startPoint = faker.helpers.arrayElement(locations);
                endPoint = faker.helpers.arrayElement(locations);
            } while (startPoint === endPoint);

            const startHour = faker.number.int({ min: 5, max: 8 });
            const endHour = faker.number.int({ min: 20, max: 23 });
            
            routes.push({
                number: i + 1,
                start_point: startPoint,
                end_point: endPoint,
                start_time: `${startHour.toString().padStart(2, '0')}:00:00`,
                end_time: `${endHour.toString().padStart(2, '0')}:00:00`,
                movement_interval: `00:${faker.helpers.arrayElement(['10', '15', '20', '25', '30'])}:00`,
                travel_time: `0${faker.number.int({ min: 3, max: 9 })}:${faker.helpers.arrayElement(['00', '15', '30', '45'])}:00`
            });
        }
        await Route.bulkCreate(routes);
        console.log(`Created ${routes.length} routes`);


        
        const workSchedules = [];

        for (let i = 0; i < RECORD_COUNT; i++) {
            const workDate = faker.date.between({ from: '2025-01-01', to: '2025-01-31' });
            
            workSchedules.push({
                driver_id: faker.number.int({ min: 1, max: RECORD_COUNT }),
                bus_id: faker.number.int({ min: 1, max: RECORD_COUNT }),
                route_id: faker.number.int({ min: 1, max: RECORD_COUNT }),
                work_date: workDate.toISOString().split('T')[0]
            });
        }
        await WorkSchedule.bulkCreate(workSchedules);
        console.log(`Created ${workSchedules.length} work schedules`);

        console.log('Summary:');
        console.log(`- Drivers: ${drivers.length}`);
        console.log(`- Buses: ${buses.length}`);
        console.log(`- Issues: ${issues.length}`);
        console.log(`- Routes: ${routes.length}`);
        console.log(`- Work Schedules: ${workSchedules.length}`);

    } catch (err) {
        console.log('Error seeding database:', err);
    }
};

seedDatabase();