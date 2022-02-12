const express = require('express');
const { auth, claimIncludes} = require('express-openid-connect');

const app = express();

app.use(
  auth({
    authRequired: false,
    errorOnRequiredAuth: true,
    authorizationParams: {
      response_type: 'code',
      response_mode: 'form_post',
      scope: 'openid offline_access roles',
      claims: {
        id_token: {"roles": { "essential" : true } }
      }   
    }
  })
);

app.get('/', async (req, res) => {
  if(req.oidc.user) // user is logged in
    res.redirect("/dashboard")
  else
    res.render('main', {title: "ACME Home", login_path:"/login"});
});

app.get('/dashboard', (req, res) =>
  res.render('dashboard', {title: "ACME Dashboard", logout_path:"/logout",
   user: req.oidc.user.sub, roles: req.oidc.idTokenClaims.roles})
);

app.get('/admin', claimIncludes('roles', 'admin'), (req, res) =>
  res.send(`Hello ${req.oidc.user.sub}, this is the admin section.`)
);

module.exports = { app }