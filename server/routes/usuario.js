const express = require('express')
const app = express()

const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuario')
const { verificaToken,verificaAdminRole } = require('../middlewares/autenticacion')

app.get('/user', verificaToken ,(req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    Usuario.find({estado: true}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.countDocuments({estado: true}, (err, count) => {
                res.json({
                    ok: true,
                    usuarios,
                    count
                })
            })

        })



})

app.post('/user', [verificaToken,verificaAdminRole], (req, res) => {

    let body = req.body
    
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save( (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.put('/user/:id', [verificaToken,verificaAdminRole], (req, res) => {
 
    let id = req.params.id
    let body = _.pick(req.body, ['nombre','email','img','role','estado'] ) 

    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators: true}, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.delete('/user/:id', [verificaToken,verificaAdminRole] ,(req, res) => {
    
    let id = req.params.id

    let changeState = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, changeState, (err, usuarioDeleted) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuarioDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDeleted
        })
    })

    // Usuario.findByIdAndRemove(id, (err, usuarioDeleted) => {

    //     if(err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if(!usuarioDeleted) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioDeleted
    //     })
    // })


})

module.exports = app