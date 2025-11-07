-- Schema SQL
CREATE TABLE BusType (
    bus_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(256) NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE SalaryRule (
    salary_rule_id SERIAL PRIMARY KEY,
    worker_class INT NOT NULL,
    experience_from INT NOT NULL,
    salary INT NOT NULL
);

CREATE TABLE Driver (
    driver_id SERIAL PRIMARY KEY,
    passport_data VARCHAR(256) NOT NULL,
    worker_class INT NOT NULL,
    experience INT NOT NULL
);

CREATE TABLE Bus (
    bus_id SERIAL PRIMARY KEY,
    bus_type_id INT NOT NULL,
    registration_number VARCHAR(16) NOT NULL,
    FOREIGN KEY (bus_type_id) REFERENCES BusType (bus_type_id)
);

CREATE TABLE Issue (
    issue_id SERIAL PRIMARY KEY,
    bus_id INT NOT NULL,
    reason VARCHAR(1024) NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES Bus (bus_id) ON DELETE CASCADE
);

CREATE TABLE Route (
    route_id SERIAL PRIMARY KEY,
    number INT NOT NULL,
    start_point VARCHAR(256) NOT NULL,
    end_point VARCHAR(256) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    movement_interval TIME NOT NULL,
    travel_time TIME NOT NULL
);

CREATE TABLE WorkSchedule (
    work_schedule_id SERIAL PRIMARY KEY,
    driver_id INT,
    bus_id INT,
    route_id INT NOT NULL,
    work_date DATE NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES Driver (driver_id) ON DELETE SET NULL,
    FOREIGN KEY (bus_id) REFERENCES Bus (bus_id) ON DELETE SET NULL,
    FOREIGN KEY (route_id) REFERENCES Route (route_id) ON DELETE CASCADE
);

-- BusType data
INSERT INTO BusType (type_name, capacity) VALUES
('Standard Bus', 50),
('Double Decker', 80),
('Mini Bus', 20);

-- SalaryRule data
INSERT INTO SalaryRule (worker_class, experience_from, salary) VALUES
(1, 0, 25000), (2, 0, 40000), (3, 0, 55000),
(1, 3, 30000), (2, 3, 45000), (3, 3, 60000),
(1, 6, 35000), (2, 6, 50000), (3, 6, 65000);

-- Driver data
INSERT INTO Driver (passport_data, worker_class, experience) VALUES
('AB1234561', 1, 1),
('AB1234562', 1, 2),
('AB1234563', 1, 3),
('AB1234564', 1, 4),
('AB1234565', 1, 5),
('AB1234566', 2, 1),
('AB1234567', 2, 2),
('AB1234568', 2, 3),
('AB1234569', 2, 4),
('AB1234570', 2, 5),
('AB1234571', 2, 6),
('AB1234572', 1, 1),
('AB1234573', 1, 2),
('AB1234574', 1, 3),
('AB1234575', 1, 4),
('AB1234576', 2, 1),
('AB1234577', 2, 2),
('AB1234578', 2, 3),
('AB1234579', 2, 4),
('AB1234580', 2, 5);

-- Bus data
INSERT INTO Bus (bus_type_id, registration_number) VALUES
(1, 'AB1001'), (1, 'AB1002'), (1, 'AB1003'), (1, 'AB1004'), (1, 'AB1005'),
(1, 'AB1006'), (1, 'AB1007'), (1, 'AB1008'), (1, 'AB1009'), (1, 'AB1010'),
(2, 'CD2001'), (2, 'CD2002'), (2, 'CD2003'), (2, 'CD2004'), (2, 'CD2005'),
(2, 'CD2006'), (2, 'CD2007'), (2, 'CD2008'), (2, 'CD2009'), (2, 'CD2010'),
(3, 'EF3001'), (3, 'EF3002'), (3, 'EF3003'), (3, 'EF3004'), (3, 'EF3005'),
(3, 'EF3006'), (3, 'EF3007'), (3, 'EF3008'), (3, 'EF3009'), (3, 'EF3010');

-- Issue data
INSERT INTO Issue (bus_id, reason) VALUES
(1, 'Engine failure'),
(5, 'Flat tire'),
(12, 'Broken door'),
(22, 'Battery issues'),
(30, 'Regular maintenance');

-- Route data
INSERT INTO Route (number, start_point, end_point, start_time, end_time, movement_interval, travel_time) VALUES
(1, 'Central Station', 'Airport', '06:00:00', '22:00:00', '00:15:00', '01:00:00'),
(2, 'Downtown', 'Stadium', '07:00:00', '20:00:00', '00:10:00', '00:45:00'),
(3, 'Suburb', 'Mall', '05:30:00', '23:00:00', '00:20:00', '01:15:00'),
(4, 'East Park', 'West End', '06:30:00', '21:30:00', '00:12:00', '00:50:00'),
(5, 'North Square', 'South Market', '06:00:00', '22:30:00', '00:18:00', '01:05:00'),
(6, 'Museum', 'Library', '08:00:00', '20:00:00', '00:20:00', '00:40:00'),
(7, 'Hospital', 'City Hall', '06:15:00', '22:00:00', '00:15:00', '00:55:00'),
(8, 'Stadium', 'Central Park', '07:00:00', '21:00:00', '00:10:00', '00:35:00'),
(9, 'Old Town', 'New Town', '06:00:00', '22:00:00', '00:15:00', '01:10:00'),
(10, 'West Station', 'East Station', '05:45:00', '23:00:00', '00:25:00', '01:20:00');

-- WorkSchedule data
INSERT INTO WorkSchedule (driver_id, bus_id, route_id, work_date) VALUES
(1, 1, 1, '2025-10-20'),
(2, 2, 1, '2025-10-20'),
(3, 3, 2, '2025-10-20'),
(4, 4, 3, '2025-10-20'),
(5, 5, 4, '2025-10-20'),
(6, 6, 5, '2025-10-20'),
(7, 7, 6, '2025-10-20'),
(8, 8, 7, '2025-10-20'),
(9, 9, 8, '2025-10-20'),
(10, 10, 9, '2025-10-20'),
(11, 11, 10, '2025-10-20'),
(12, 12, 1, '2025-10-20'),
(13, 13, 2, '2025-10-20'),
(14, 14, 3, '2025-10-20'),
(15, 15, 4, '2025-10-20'),
(16, 16, 5, '2025-10-20'),
(17, 17, 6, '2025-10-20'),
(18, 18, 7, '2025-10-20'),
(19, 19, 8, '2025-10-20'),
(20, 20, 9, '2025-10-20'),
(1, 21, 10, '2025-10-21'),
(2, 22, 1, '2025-10-21'),
(3, 23, 2, '2025-10-21'),
(4, 24, 3, '2025-10-21'),
(5, 25, 4, '2025-10-21'),
(6, 26, 5, '2025-10-21'),
(7, 27, 6, '2025-10-21'),
(8, 28, 7, '2025-10-21'),
(9, 29, 8, '2025-10-21'),
(10, 30, 9, '2025-10-21');


-- Query SQL
-- Display relations
SELECT * FROM BusType;      -- 1
SELECT * FROM SalaryRule;   -- 2
SELECT * FROM Driver;       -- 3
SELECT * FROM Bus;          -- 4
SELECT * FROM Issue;        -- 5
SELECT * FROM Route;        -- 6
SELECT * FROM WorkSchedule; -- 7

-- List of drivers working on a specific route along with their work schedule?
-- 8
SELECT D.*, W.*
FROM Driver AS D
JOIN WorkSchedule AS W
ON D.driver_id = W.driver_id
WHERE W.route_id = 10;

-- Which buses serve the given route?
-- 9
SELECT B.*, W.*
FROM Bus as B
JOIN WorkSchedule AS W
ON B.bus_id = W.bus_id
WHERE W.route_id = 10;

-- Which routes start or end at a location with the specified name?
-- 10
SELECT *
FROM Route as R
WHERE (R.start_point = 'Stadium' or R.end_point = 'Stadium');

-- When does bus movement start and end on each route?
-- 11
SELECT number, start_time, end_time
FROM Route;

-- What is the travel time for a particular route?
-- 12
SELECT number, travel_time
FROM Route;

-- What is the total travel time of all routes served by the fleet?
-- 13
SELECT SUM(travel_time)
FROM Route;

-- Which buses did not go on line and for what reason (malfunction, absence of driver)?
-- 14
SELECT W.*, I.*
FROM WorkSchedule as W
JOIN Issue as I
ON W.bus_id = I.bus_id;

-- Add a new driver to the database
-- 15
INSERT INTO Driver (passport_data, worker_class, experience)
VALUES ('AB1234581', 1, 0);

-- Remove a bus from the database (does NOT remove schedule entries automatically)
-- 16
DELETE FROM Bus
WHERE bus_id = 15;

-- Add a new route to the database
-- 17
INSERT INTO Route (number, start_point, end_point, start_time, end_time, movement_interval, travel_time)
VALUES (11, 'New Start', 'New End', '06:00:00', '22:00:00', '00:15:00', '01:00:00');

-- Update an existing route's times
-- 18
UPDATE Route
SET start_time = '07:00:00', end_time = '21:00:00'
WHERE route_id = 3;

-- Update driver's experience
-- 19
UPDATE Driver
SET experience = 3
WHERE driver_id = 1;

-- Display relations
SELECT * FROM BusType;      -- 20
SELECT * FROM SalaryRule;   -- 21
SELECT * FROM Driver;       -- 22
SELECT * FROM Bus;          -- 23
SELECT * FROM Issue;        -- 24
SELECT * FROM Route;        -- 25
SELECT * FROM WorkSchedule; -- 26