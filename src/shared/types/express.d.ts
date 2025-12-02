import { TokenPayload } from '../libs/auth/token.service.js';

declare global {
    namespace Express {
        export interface Request {
            user?: TokenPayload;
        }
    }
}

export { };
