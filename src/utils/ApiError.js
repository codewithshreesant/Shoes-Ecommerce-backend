
class ApiError extends Error{
    constructor(
        statusCode,
        error,
        message,
        data
    )
    {
        super();
        this.statusCode=statusCode,
        this.error=error;
        this.message=message;
        this.data=data;
    }
}

export {ApiError}