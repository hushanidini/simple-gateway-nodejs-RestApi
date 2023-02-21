import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const PeripheralSchema = new Schema({
    uid: {
        type: Number,
        unique: true,
        required: "Uid is required",
    },
    vendor: {
        type: String,
        required: "Vendor is required",
    },
    status: {
        type: String,
        required: "Status is required",
        validate: {
            validator: function (value) {
                return value === 'online' || value === 'offline';
            },
            message: "Status must be `online` or `offline`."
        }
    },
    gateway: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gateway',
    },
    time : { type : Date, default: Date.now }
    
}, 
{
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id;
        delete ret.__v;
      }
    }
  }

);

