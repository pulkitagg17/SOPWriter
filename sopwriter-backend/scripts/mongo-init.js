db = db.getSiblingDB('sopwriter');

db.createUser({
    user: 'sopwriter_user',
    pwd: 'sopwriter_pass',
    roles: [
        {
            role: 'readWrite',
            db: 'sopwriter',
        },
    ],
});

db.createCollection('services');
db.createCollection('users');
