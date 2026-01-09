const DEBUG = process.env.NODE_ENV !== 'production';

export class Logger {
    static info(msg: string, ...args: unknown[]) {
        if (DEBUG) console.log(msg, ...args);
    }

    static warn(msg: string, ...args: unknown[]) {
        if (DEBUG) console.warn(msg, ...args);
    }

    static error(msg: string, ...args: unknown[]) {
        console.error(msg, ...args);
    }
}
