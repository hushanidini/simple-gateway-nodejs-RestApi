import mongoose from 'mongoose';
import { GatewaySchema } from '../models/gateway';

const Gateway = mongoose.model('gateway', GatewaySchema);

const gatewayRoutes =  (app) => {
    //GATEWAY ROUTES
    app.route('/api/v1/gateways')
    .get(async function (req, res, next)  {
            try {
                const models = await Gateway.find({}, [], {sort: {name: 1}}).populate('peripherals');
                res.status(200).json(models);
            } catch (e) {
                return res.status(500).json({message: e.message});
            }
        })
  

    .post(async function(req, res) {
            const model = new Gateway({
                serial: req.body.serial,
                name: req.body.name,
                ip: req.body.ip
            });
            try {
                const result = await model.save();
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
      
            if (req.body.serial != null) {
                res.model.serial = req.body.serial;
            }
            if (req.body.name != null) {
                res.model.name = req.body.name;
            }
            if (req.body.ip != null) {
                res.model.ip = req.body.ip;
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
        model = await Gateway.findById(req.params.id).populate('peripherals', [], {}, {sort: {uid: 1}});
        if (model == null) {
            return res.status(404).json({message: 'Resource not found.'});
        }
    } catch (e) {
        return res.status(500).json({message: e.message});
    }
    res.model = model;
    next();
}

export default gatewayRoutes;
