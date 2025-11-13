const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('bus', 'postgres', '1234', {
    dialect: 'postgres',
    host: 'postgres-container',
    port: '5432'
});

const BusType = sequelize.define(
    'BusType',
    {
        bus_type_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

const SalaryRule = sequelize.define(
    'SalaryRule',
    {
        salary_rule_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        worker_class: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        experience_from: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        salary: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

const Driver = sequelize.define(
    'Driver',
    {
        driver_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        passport_data: {
            type: DataTypes.STRING,
            allowNull: false
        },
        worker_class: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

const Bus = sequelize.define(
    'Bus',
    {
        bus_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bus_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        registration_number: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

const Issue = sequelize.define(
    'Issue',
    {
        issue_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bus_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

const Route = sequelize.define(
    'Route',
    {
        route_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_point: {
            type: DataTypes.STRING,
            allowNull: false
        },
        end_point: {
            type: DataTypes.STRING,
            allowNull: false
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        movement_interval: {
            type: DataTypes.TIME,
            allowNull: false
        },
        travel_time: {
            type: DataTypes.TIME,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

const WorkSchedule = sequelize.define(
    'WorkSchedule',
    {
        work_schedule_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        driver_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        bus_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        route_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        work_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

BusType.hasMany(Bus, { foreignKey: 'bus_type_id' });
Bus.belongsTo(BusType, { foreignKey: 'bus_type_id' });

Bus.hasMany(Issue, { foreignKey: 'bus_id', onDelete: 'CASCADE' });
Issue.belongsTo(Bus, { foreignKey: 'bus_id' });

Driver.hasMany(WorkSchedule, { foreignKey: 'driver_id', onDelete: 'SET NULL' });
WorkSchedule.belongsTo(Driver, { foreignKey: 'driver_id' });

Bus.hasMany(WorkSchedule, { foreignKey: 'bus_id', onDelete: 'SET NULL' });
WorkSchedule.belongsTo(Bus, { foreignKey: 'bus_id' });

Route.hasMany(WorkSchedule, { foreignKey: 'route_id', onDelete: 'CASCADE' });
WorkSchedule.belongsTo(Route, { foreignKey: 'route_id' });

module.exports = {
    sequelize,
    BusType,
    SalaryRule, 
    Driver,
    Bus,
    Issue,
    Route,
    WorkSchedule
};

