// ========================
// Port
// ========================

process.env.PORT = process.env.PORT || 3000


// ========================
// Entorno
// ========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ========================
// Vencimiento Token
// ========================

process.env.CADUCIDAD_TOKEN = '48h'

// ========================
// Seed Autentication
// ========================

process.env.SEED = process.env.SEED || 'seed-desarrollo'

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '194708379507-pv3jdfs337kascplhnqi57o6s7jauk6m.apps.googleusercontent.com'


// ========================
// DB
// ========================

let urlDB

if( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI
}

process.env.urlDB = urlDB
