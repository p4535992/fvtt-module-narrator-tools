

import CONSTANTS from './constants';
import API from './api';
import { registerSocket } from './socket';
import { setApi } from '../main';
import { NarratorTools } from './narrator';

export const initHooks = (): void => {
  // registerSettings();
  // registerLibwrappers();
  // new HandlebarHelpers().registerHelpers();

  Hooks.once('socketlib.ready', registerSocket);
};

export const setupHooks = (): void => {
  // setup all the hooks
  setApi(API);

  NarratorTools._setup();
};

export const readyHooks = (): void => {
  // checkSystem();
  // registerHotkeys();
  // Hooks.callAll(HOOKS.READY);
  NarratorTools._ready();
  Hooks.on('chatMessage', NarratorTools._chatMessage.bind(NarratorTools)); // This hook spans the chatmsg
  Hooks.on('preCreateChatMessage', NarratorTools._preCreateChatMessage.bind(NarratorTools));
  Hooks.on('renderChatMessage', NarratorTools._renderChatMessage.bind(NarratorTools)); // This hook changes the chat message in case its a narration + triggers
  Hooks.on('renderSceneControls', NarratorTools._createSceneryButton.bind(NarratorTools));
  Hooks.on('collapseSidebar', NarratorTools._fitSidebar.bind(NarratorTools));
  Hooks.on('pauseGame', (_pause: boolean) => NarratorTools._pause());
};
