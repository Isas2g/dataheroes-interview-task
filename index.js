const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');

const charactersUrl = 'https://rickandmortyapi.com/api/character';

// Connecting to database
const sequelize = new Sequelize('db1', 'candidate', '62I8anq3cFq5GYh2u4Lh', {
    dialect: 'postgres',
    host: 'rc1c-2m0keqdcncuwizmx.mdb.yandexcloud.net',
    port: 6432,
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Testing the connection
async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

test();

//Defining a character model and "Isas2g" table
const Character = sequelize.define('Character', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    tableName: 'isas2g',
    timestamps: false
});


(async() => {
    await Character.sync({
        force: true
    });

    async function getCharacters(url) {
        const { data } = await axios(url);

        const next = data.info.next;
        const characters = data.results;

        if (next) {
            for (let character of characters) {
                let name = character.name;

                await Character.create({
                    name,
                    data: JSON.stringify(character)
                });
            };

            return getCharacters(next);
        } else {
            return console.log('All done!');
        }

    };

    getCharacters(charactersUrl);
})();