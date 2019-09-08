class Logger {
    constructor() {
        this._level = 0;
        this._levels = ['nolog', 'log', 'debug', 'info', 'warn', 'error'];
    }

    log() {
        this._print(1, arguments);
    }

    debug() {
        this._print(2, arguments);
    }

    info() {
        this._print(3, arguments);
    }

    warn() {
        this._print(4, arguments);
    }

    error() {
        this._print(5, arguments);
    }

    setLevel = (level) => {
        this._level = level;
    };

    // 打印到控制台，将来可以收集到后端存储
    _print = (level, args) => {
        if (level <= this._level) return;
        console[this._levels[level]](...args);
        // report log
    };
}

const logger = new Logger();

export default logger;
