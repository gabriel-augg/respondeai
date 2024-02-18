const checkAuth = (req, res, next) => {
    const userId = req.session.userid

    if(!userId){
        res.redirect('/entrar')
    }
    next()
} 

export { checkAuth }
