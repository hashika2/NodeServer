const express = require('express');
const router = express.Router();
const { Register,Login,Logout } = require('./Auth');

router.post('/',(req, res) => {
    const register = Register(req,res);
    return register;    
});   

router.post('/login',(req, res) => { 
  const login = Login(req,res);
  return login;    
});

router.post('/logout',(req, res) => { 
  const logout = Logout(req,res);
  return logout;    
});

module.exports = router;