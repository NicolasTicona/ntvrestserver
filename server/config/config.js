// ========================
// Port
// ========================

process.env.PORT = process.env.PORT || 3000


// ========================
// Entorno
// ========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ========================
// DB
// ========================

let urlDB

if( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = 'mongodb://cafe-user:a123456@ds263791.mlab.com:63791/cafe'
}

process.env.urlDB = urlDB