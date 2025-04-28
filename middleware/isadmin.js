const isadmin = (req, res, next) =>{
    if (req.userRole != "admin"){
        res.status(403).json({message: 'Acess Denied'});
    }
    next();
};
module.exports=isadmin;