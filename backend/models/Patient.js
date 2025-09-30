// Patient model is already defined in User.js using discriminator pattern
// Re-export it for convenience
const { Patient } = require('./User');
module.exports = Patient;

module.exports = Patient;