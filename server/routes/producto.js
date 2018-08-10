const express = require('express')
const router = express.Router()

const Producto = require('../models/producto')

const { verificaToken } = require('../middlewares/autenticacion')



// Obtener productos
router.get('/productos', verificaToken, (req, res) => {

    let mostar = req.query.mostar || 5
    mostar = Number(mostar)
    let skip = req.query.skip || 0
    skip = Number(skip)

    Producto.find({disponible: true})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(skip)
        .limit(mostar)
        .exec((err, productosDB) => {

            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    productos: productosDB,
                    count
                })
            })

        })

})


// Obtener producto
router.get('/productos/:id',verificaToken, (req,res) => {

    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productoDB) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
})

// Buscar Productos
router.get('/productos/buscar/:termino', verificaToken, (req,res) => {

    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex})
        .populate('categoria', 'descripcion')
        .exec( (err, productos) => {

            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })

})


// Crear producto
router.post('/producto', verificaToken, (req,res) => {

    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,   
        categoria: body.categoria,
        usuario: req.usuario._id
    })
  
    producto.save((err, productoDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            message: 'Producto creado',
            producto: productoDB
        })
    })
})


// Actualizar producto
router.put('/producto/:id', verificaToken, (req,res) => {

    let id = req.params.id
    let body = req.body

    Producto.findByIdAndUpdate(id, body, {new: true}, (err, productoDB) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })  
    })


})


// Deshabilitar el producto
router.delete('/producto/:id', verificaToken, (req,res) => {

    let id = req.params.id

    let changeState = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, changeState, {new: true}, (err, productoDB) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            message: 'Producto eliminado',
            producto: productoDB
        })
    })

})



module.exports = router