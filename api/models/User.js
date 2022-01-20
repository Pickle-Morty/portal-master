const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nanoid = require("nanoid");
const differenceInMinutes = require('date-fns/difference_in_minutes');

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Поле обязательно для заполения'],
        unique: true,
        validate: {
            validator: async  function (value) {
                if (!this.isModified('email')) return;
                const user = await User.findOne({email: value});
                if (user) throw new Error(`Email ${value} уже используется!`);
            }
        }
    },
    role: {
        type: String,
        required: true,
        default: 'student',
        enum: ['admin', 'student', 'teacher']
    },
    password: {
        type: String,
        required: [true, 'Поле обязательно для заполения'],
        minlength: [8, 'Должно быть не меньше 8 символов.'],
    },
    firstName: {
        type: String,
        required: [true, 'Поле обязательно для заполения']
    },
    secondName: {
        type: String,
        required: [true, 'Поле обязательно для заполения']
    },
    lastName: {
        type: String,
        required: [true, 'Поле обязательно для заполения']
    },
    fullName: {
        type: String,
    },
    appointSubjects: {
        type: [{type: Schema.ObjectId, ref: 'Subject'}],
        default: [],
    },
    token: {
        type: String,
        required: true
    },
    last_seen: {
        type: Date,
        default: new Date
    },
}, {timestamps: true});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

UserSchema.virtual('isOnline').get(function() {
    return differenceInMinutes(new Date().toISOString(), this.last_seen) < 5;
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;

    next();
});

UserSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
