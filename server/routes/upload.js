const express = require('express')
const fileupload = require('express-fileupload')
const app = express()

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

const fs = require('fs')
const path = require('path')

app.use(fileupload())


app.put('/upload/:tipo/:id', (req,res) => {


    let tipo = req.params.tipo
    let id = req.params.id

    let tiposValidos = ['usuarios', 'productos']

    if( tiposValidos.indexOf( tipo ) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidos son ' + tiposValidos.join(' '),
            }
        })
    }

    if(!req.files){
        return res.status(400).json({
            ok:false, 
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        })
    }
    
    let archivo = req.files.archivo
    let nombreArchivo = archivo.name.split('.')
    let extension = nombreArchivo[nombreArchivo.length - 1]

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if( extensionesValidas.indexOf( extension ) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(' '),
                extension
            }
        })
    }

    // Cambiar nombre del archivo
    let nombre_Arch = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombre_Arch}`, (err) => {

        if(err){
            res.status(500).json({
                ok: false,
                err
            })
        }


        if(tipo === 'usuarios'){
            imagenUsuario(id,res, nombre_Arch)
        }

        if(tipo === 'productos'){
            imagenProducto(id, res, nombre_Arch)
        }

    })
})


const imagenUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, (err, usuarioDB) => {
        if(err) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borrarArchivo(usuarioDB.img, 'usuarios')


        usuarioDB.img = nombreArchivo
        usuarioDB.save((err, usuarioSaved) => {

            res.json({
                ok: true,
                usuario: usuarioSaved,
                img: nombreArchivo
            })
        })
    })
}

const imagenProducto = (id, res, nombreArchivo) => {

    Producto.findById(id, (err, productoDB) => {
        if(err) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        borrarArchivo(productoDB.img, 'productos')


        productoDB.img = nombreArchivo
        productoDB.save((err, productoSaved) => {

            res.json({
                ok: true,
                producto: productoSaved,
                img: nombreArchivo
            })
        })
    })
}

const  borrarArchivo =  (nombreImagen, tipo) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
    }
}








module.exports = app