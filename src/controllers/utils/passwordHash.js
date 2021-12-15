const bcryptjs = require('bcryptjs');

module.exports = async function (password) {
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt)
    return passwordHash
}
