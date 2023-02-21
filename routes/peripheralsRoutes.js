
import mongoose from 'mongoose';
import {PeripheralSchema} from "../models/peripheral";
import { GatewaySchema } from '../models/gateway';

const Gateway = mongoose.model('gateway', GatewaySchema);
const Peripheral = mongoose.model('Peripheral', PeripheralSchema);

const peripheralsRoutes =  (app) => {
    //PERIPHERAL ROUTES
    app.route('/api/v1/peripheral')
    .get(async function (req, res, next)  {
               try {
                    const models = await Peripheral.find({}, [], {sort: {uid: 1}}).populate('gateway');
                    res.status(200).json(models);
                } catch (e) {
                    return res.status(500).json({message: e.message});
                }
        })
  
    app.route('/api/v1/peripheral/:gateway_id')
    .post(async function(req, res) {
        let gateway;
        try {
            gateway = await Gateway.findById(req.params.gateway_id);
            if (gateway == null) {
                return res.status(404).json({message: 'Gateway not found.'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

        if (gateway.peripherals.length >= 10) {
            return res.status(400).json({message: 'Full gateway.'});
        }

        const model = new Peripheral({
            uid: req.body.uid,
            vendor: req.body.vendor,
            status: req.body.status,
            gateway: gateway._id,
        });
        try {
            const result = await model.save();
            gateway.peripherals.push(result._id);
            await gateway.save();
            res.status(201).json(result);
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
       
    })

    app.route('/api/v1/gateways/:id')
    .get(findModel, async function (req, res, next)  {
        try {
            await res.status(200).json(res.model);
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    })

    .put(findModel, async function (req, res, next)  {
      
        if (req.body.uid != null) {
            res.model.uid = req.body.uid;
        }
        if (req.body.vendor != null) {
            res.model.vendor = req.body.vendor;
        }
        if (req.body.status != null) {
            res.model.status = req.body.status;
        }
        try {
            const result = await res.model.save();
            res.status(200).json(result);
        } catch (e) {
            return res.status(400).json({message: e.message});
        }
    })

    .delete(findModel, async function (req, res, next)  {
         try {
            const result = await res.model.remove();
            res.status(200).json(result);
        } catch (e) {
            res.status(500).json({message: e.message});
        }
    })



}

async function findModel(req, res, next) {
    let model = null;
    try {
        model = await Peripheral.findById(req.params.id).populate('gateway');
        if (model == null) {
            return res.status(404).json({message: 'Resource not found.'});
        }
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
    res.model = model;
    next();
}

export default peripheralsRoutes;