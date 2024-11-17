declare module 'formidable' {
    import { IncomingForm } from 'formidable';
    export { IncomingForm };
    export type Fields = { [key: string]: any };
    export type Files = { [key: string]: any };
}