const mongoose = require('mongoose');

const roleSchema = mongoose.Schema(
    {
        //_id = mongoose.Schema.Types.ObjectId,
        name: {type:String, required: true},
        permission : {type: Array, required:true}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Roles", roleSchema)