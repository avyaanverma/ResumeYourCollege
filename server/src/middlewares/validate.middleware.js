import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/ApiResponse.js";

export const validate = (schema) => (req,res,next)=>{
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params
    });

    if(!result.success){
        const errors = result.error.issues.map((err)=>({
            field: err.path.join('.'),
            message: err.message
        }))
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json(new ApiResponse(StatusCodes.BAD_REQUEST, "Validation Failed", errors));
    }

    if (result.data.body) req.body = result.data.body;
    if (result.data.query) Object.assign(req.query, result.data.query);
    if (result.data.params) Object.assign(req.params, result.data.params);

    next();
}