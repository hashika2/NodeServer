const validateHeaders = (req) =>{
    const status = (req.get('Content-Type').split(';')[0]=='application/json')&&(req.headers['x-device']=='PC')&&(req.headers['x-browser']=='Chrome');
    return  status;
}

module.exports = validateHeaders;