function notFoundHandler(req, res, next){
    const err = new Error(req.originalUrl);
    err.status = 404;
    next(err);
};

function finalErrorHandler(err, req, res, next){
    const status = err.status || 500;
    const message = status === 500 
        ? "Internal Server Error (Check Server Logs)"
        : err.message;


    res.status(err.status || 500).json({
        "error" : true,
        "status" : status,
        "message" : message,
    });
}

export {notFoundHandler, finalErrorHandler};
