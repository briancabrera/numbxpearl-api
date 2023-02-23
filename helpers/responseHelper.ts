import express from 'express';

export function makeResponse(
    response: express.Response,
    status: number = 200,
    data: any,
    success: boolean = true,
    errors: string[] = []) {
        response.status(status).json({
            data: data,
            success: success,
            erros: errors
        });

        response.end();
        return response;
}