import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  log(message: string, context?: string) {
    if (this.shouldLog(message)) {
      super.log(message, context);
    }
  }

  error(message: string, trace?: string, context?: string) {
    if (this.shouldLog(message)) {
      super.error(message, trace, context);
    }
  }

  warn(message: string, context?: string) {
    if (this.shouldLog(message)) {
      super.warn(message, context);
    }
  }

  debug(message: string, context?: string) {
    if (this.shouldLog(message)) {
      super.debug(message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.shouldLog(message)) {
      super.verbose(message, context);
    }
  }

  private shouldLog(message: string): boolean {
    const serveStaticError = "ENOENT: no such file or directory, stat '/usr/app/profilepics/index.html'";
    const renameError = "ENOENT: no such file or directory, rename '/usr/app/profilepics/";

    return !message.includes(serveStaticError) && !message.startsWith(renameError);
  }
}