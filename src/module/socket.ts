import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';
import { setSocket } from '../main';

export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: 'callHook',
};

export let narratorToolsSocket;

export function registerSocket() {
  debug('Registered narratorToolsSocket');
  if (narratorToolsSocket) {
    return narratorToolsSocket;
  }
  //@ts-ignore
  narratorToolsSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  /**
   * Generic socket
   */
  narratorToolsSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));
  narratorToolsSocket.register('updateContentStyle', (...args) =>
    API.updateContentStyleArr(...args),
  );
  setSocket(narratorToolsSocket);
  return narratorToolsSocket;
}

async function callHook(inHookName, ...args) {
  const newArgs: any[] = [];
  for (let arg of args) {
    if (typeof arg === 'string') {
      const testArg = await fromUuid(arg);
      if (testArg) {
        arg = testArg;
      }
    }
    newArgs.push(arg);
  }
  return Hooks.callAll(inHookName, ...newArgs);
}
