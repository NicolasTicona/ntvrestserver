const express = require('express')
const router = express.Router()

const Categoria = require('../models/categoria')

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
let _ = require('underscore')


// Obtener categorias
router.get('/categorias', verificaToken, (req, res) => {

    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })

})

// Obetener una categoria
router.get('/categorias/:id', verificaToken, (req,res) => {

    let id = req.params.id

    Categoria.findById(id)
        .exec((err, categoriaDB) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })
})


// Crear una nueva categoria
router.post('/categoria', verificaToken, (req,res) => {

    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaCreated) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaCreated
        })  
    })
})


// Actualizar categoria
router.put('/categoria/:id', verificaToken, (req,res) => {

    let id = req.params.id
    let body = _.pick(req.body, ['descripcion'])

    Categoria.findByIdAndUpdate(id, body, {new: true}, (err, categoriaUpdated) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaUpdated) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaUpdated
        })  
    })
})

// Eliminar categoria
router.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req,res) => {

    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaDeleted) => {
 
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        }) 
    })
})

module.exports = router