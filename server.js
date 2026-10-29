// Cargar variables de entorno desde .env
require('dotenv').config();

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var validation = require('./libs/unalib');
var { auth } = require('express-openid-connect');

var port = process.env.PORT || 3000;

var issuer = process.env.AUTH0_ISSUER_BASE_URL || '';
if (issuer && !issuer.startsWith('http://') && !issuer.startsWith('https://')) {
  issuer = 'https://' + issuer;
}

// Determinar la URL base: si está en Vercel, usar automáticamente el dominio de Vercel
var baseURL = process.env.AUTH0_BASE_URL;
if (process.env.VERCEL) {
  if (!baseURL || baseURL.indexOf('localhost') !== -1) {
    baseURL = 'https://lab5-paradigmas-inky.vercel.app';
  }
}
if (!baseURL) {
  baseURL = 'http://localhost:' + port;
}
baseURL = baseURL.replace(/\/+$/, '');

// Configuración de Auth0 (Regular Web Application)
var authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: baseURL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: issuer,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  },
  routes: {
    login: '/login',
    callback: '/callback',
    postLogoutRedirect: '/'
  }
};

// Middleware de autenticación de Auth0
app.use(auth(authConfig));

// Middleware para servir recursos estáticos si se requieren
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal: si está autenticado muestra el chat; si no, solicita iniciar sesión (Criterio 6)
app.get('/', function(req, res){
  if (req.oidc && req.oidc.isAuthenticated()) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // Pantalla de bienvenida y solicitud de autenticación
  res.send(`
    <!doctype html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Bienvenido - UNA Chat</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .login-card {
          background: rgba(30, 41, 59, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 440px;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
        }
        .logo-icon {
          width: 64px;
          height: 64px;
          background: #dc2626;
          color: white;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 20px;
          box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.4);
        }
        h1 { font-size: 26px; font-weight: 700; margin-bottom: 12px; color: #ffffff; }
        p { color: #94a3b8; font-size: 15px; line-height: 1.5; margin-bottom: 30px; }
        .btn-login {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #ffffff;
          color: #0f172a;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          padding: 14px 24px;
          border-radius: 10px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn-login:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
        }
        .google-icon {
          width: 20px;
          height: 20px;
        }
        .footer-note {
          margin-top: 25px;
          font-size: 13px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="login-card">
        <div class="logo-icon">UNA</div>
        <h1>UNA Chat</h1>
        <p>Para ingresar a la sala de conversación y enviar mensajes, debes autenticarte con tu cuenta social.</p>
        <a href="/login" class="btn-login">
          <svg class="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          Iniciar sesión con Auth0
        </a>
        <div class="footer-note">
          Laboratorio 6 • Paradigmas de Programación
        </div>
      </div>
    </body>
    </html>
  `);
});

// Endpoint para entregar los datos del usuario autenticado al frontend (Criterio 5)
app.get('/api/user', function(req, res){
  if (req.oidc && req.oidc.isAuthenticated()) {
    var user = req.oidc.user;
    return res.json({
      authenticated: true,
      user: {
        name: user.name || user.nickname || user.email,
        email: user.email,
        picture: user.picture || 'https://via.placeholder.com/40'
      }
    });
  }
  return res.status(401).json({ authenticated: false });
});

// Middleware para manejo de errores de autenticación o cancelación (Criterio 9)
app.use(function(err, req, res, next){
  if (err) {
    console.error('Error de autenticación:', err.message);
    return res.status(500).send(`
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Error de Autenticación - UNA Chat</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc;
          }
          .card {
            background: #1e293b; padding: 36px; border-radius: 14px;
            border: 1px solid rgba(239, 68, 68, 0.3); text-align: center;
            max-width: 440px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
          }
          h2 { color: #f87171; margin-bottom: 12px; font-size: 22px; }
          p { color: #94a3b8; line-height: 1.5; margin-bottom: 24px; font-size: 14px; }
          .btn {
            display: inline-block; background: #2563eb; color: white;
            padding: 12px 24px; border-radius: 8px; text-decoration: none;
            font-weight: 600; font-size: 15px; transition: background 0.2s;
          }
          .btn:hover { background: #1d4ed8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Inicio de sesión no completado</h2>
          <p>${err.message || 'El inicio de sesión fue cancelado o ocurrió un error al validar tus credenciales en Auth0.'}</p>
          <a href="/login" class="btn">Reintentar inicio de sesión</a>
        </div>
      </body>
      </html>
    `);
  }
  next();
});

// Escuchar conexiones de Socket.IO
io.on('connection', function(socket){
  socket.on('Evento-Mensaje-Server', function(msg){
    msg = validation.validateMessage(msg);
    io.emit('Evento-Mensaje-Server', msg);
  });
});

// Iniciar servidor localmente
if (!process.env.VERCEL) {
  http.listen(port, function(){
    console.log('Servidor UNA Chat escuchando en el puerto ' + port);
  });
}

// Exportar app para soporte serverless en Vercel
module.exports = app;

