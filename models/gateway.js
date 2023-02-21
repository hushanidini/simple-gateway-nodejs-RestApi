import mongoose from 'mongoose';
import {isIPAddress, isIPV6Address, isIPV4Address, ipVersion} from 'ip-address-validator';

const Schema = mongoose.Schema;

export const GatewaySchema = new Schema({
    serial: {
        type: String,
        required: 'Enter a serial'
    },
    name: {
        type: String,
        required: 'Enter a name'
    },
    ip: {
        type: String,
          required: "Ip is required",
          unique: true,
          validate: {
            validator: function (value) {
                return isIPV4Address(value);
            },
            message: "Invalid IPv4 address."
        }
    },
    peripherals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Peripheral',
    }],
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


