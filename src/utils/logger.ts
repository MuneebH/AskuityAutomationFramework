/**
 * Simple logger utility for test automation
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

class Logger {
  private currentLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'INFO';

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
    return levels[level] >= levels[this.currentLogLevel];
  }

  private formatMessage(level: LogLevel, message: string): string {
    return `[${this.getTimestamp()}] [${level}] ${message}`;
  }

  debug(message: string): void {
    if (this.shouldLog('DEBUG')) {
      console.log(this.formatMessage('DEBUG', message));
    }
  }

  info(message: string): void {
    if (this.shouldLog('INFO')) {
      console.log(this.formatMessage('INFO', message));
    }
  }

  warn(message: string): void {
    if (this.shouldLog('WARN')) {
      console.warn(this.formatMessage('WARN', message));
    }
  }

  error(message: string, error?: Error): void {
    if (this.shouldLog('ERROR')) {
      console.error(this.formatMessage('ERROR', message));
      if (error) {
        console.error(error.stack);
      }
    }
  }
}

export const logger = new Logger();
