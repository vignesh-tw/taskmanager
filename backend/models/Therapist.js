// Therapist model is already defined in User.js using discriminator pattern
// Re-export it for convenience
const { Therapist } = require("./User");
module.exports = Therapist;
