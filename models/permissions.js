const mongoose = require('mongoose');

const permissionSchema = mongoose.Schema(
    {
        //_id = mongoose.Schema.Types.ObjectId,
        name: {type:String, required: true},
        group : {type:String, required:true}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Permissions", permissionSchema)