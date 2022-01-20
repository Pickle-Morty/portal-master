const User = require('../models/User');

const updateLastSeen = async (req, res, next) => {
    if (req.user) {
        User.findOneAndUpdate(
          { _id: req.user.id },
          {
            last_seen: new Date()
          },
          { new: true },
          () => {}
        );
      }
      next();
};

module.exports = updateLastSeen;