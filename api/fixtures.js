const mongoose = require('mongoose');
const config = require('./config');
const nanoid = require('nanoid');

const User = require('./models/User');

const run = async () => {
    await mongoose.connect(config.dbUrl, config.mongoOption);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();

    for (let collection of collections) {
        await collection.drop();
    }

    await User.create ({
        email: 'admin@admin.com',
        password: '12345678',
        firstName: 'Иван',
        secondName: 'Иванов',
        lastName: 'Иванович',
        role: 'admin',
        fullName: 'Иванов Иван Иванович',
        appointSubjects: [],
        token: nanoid()
    }, {
        email: 'user@user.com',
        password: '12345678',
        firstName: 'Антон',
        secondName: 'Антонов',
        lastName: 'Антонович',
        role: 'student',
        fullName: 'Антонов Антон Антонович',
        token: nanoid()
    }, {
        email: 'teacher@teacher.com',
        password: '12345678',
        firstName: 'Петр',
        secondName: 'Петров',
        lastName: 'Петрович',
        fullName: 'Петров Петр Петрович',
        appointSubjects: [],
        role: 'teacher',
        token: nanoid()
    });

    return connection.close();
};

run().catch(error => {
    console.log('Oops something happened...', error);
});