import API from './api';
import CONSTANTS from './constants';
import { dialogWarning, i18n, warn } from './lib/lib';
import { NarrationState, NarratorMenu, NarratorTools } from './narrator';

export const registerSettings = function (): void {
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'resetAllSettings', {
    name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
    icon: 'fas fa-coins',
    type: ResetSettingsDialog,
    restricted: true,
  });

  // =====================================================================

  // Game Settings
  // The shared state of the Narrator Tools application, emitted by the DM across all players
  // Q:   Why use a setting instead of sockets?
  // A:   So there is memory. The screen will only update with the DM present and remain in that state.
  //      For instance, the DM might leave the game with a message on screen.
  //      There should be no concurrency between sockets and this config,
  //      so we eliminated sockets altogether.
  game.settings.register(CONSTANTS.MODULE_NAME, 'sharedState', {
    name: 'Shared State',
    scope: 'world',
    config: false,
    default: {
      /**Displays information about whats happening on screen */
      narration: {
        id: 0,
        display: false,
        new: false,
        message: '',
        paused: false,
      } as NarrationState,
      /**If the background scenery is on or off */
      scenery: false,
    },
    onChange: (newState: { narration: NarrationState; scenery: boolean }) => NarratorTools._controller(newState),
  });
  // Register the application menu
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'settingsMenu', {
    name: game.i18n.localize('SETTINGS.Configure'),
    label: game.i18n.localize('SCENES.Configure'),
    icon: 'fas fa-adjust',
    type: NarratorMenu,
    restricted: true,
  });
  // Menu options
  game.settings.register(CONSTANTS.MODULE_NAME, 'FontSize', {
    name: 'Font Size',
    scope: 'world',
    config: false,
    default: '',
    type: String,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'WebFont', {
    name: 'Web Font',
    scope: 'world',
    config: false,
    default: '',
    type: String,
    onChange: (value: string) => NarratorTools._loadFont(value),
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'TextColor', {
    name: 'Text Color',
    scope: 'world',
    config: false,
    default: '',
    type: String,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'TextShadow', {
    name: 'Text Shadow',
    scope: 'world',
    config: false,
    default: '',
    type: String,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'TextCSS', {
    name: 'TextCSS',
    scope: 'world',
    config: false,
    default: '',
    type: String,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'Copy', {
    name: 'Copy',
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'Pause', {
    name: 'Pause',
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'DurationMultiplier', {
    name: 'Duration Multiplier',
    scope: 'world',
    config: false,
    default: 1,
    type: Number,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'BGColor', {
    name: 'Background Color',
    scope: 'world',
    config: false,
    default: '',
    type: String,
    onChange: (color: string) => NarratorTools._updateBGColor(color),
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'BGImage', {
    name: 'Background Color',
    scope: 'world',
    config: false,
    default: '',
    type: String,
    onChange: (filePath: string) => NarratorTools._updateBGImage(filePath),
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'NarrationStartPaused', {
    name: 'Start the Narration Paused',
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'MessageType', {
    name: 'Narration Message Type',
    scope: 'world',
    config: false,
    default: CONST.CHAT_MESSAGE_TYPES.OTHER,
    type: Number,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'PERMScenery', {
    name: 'Permission Required to set the Scenery',
    scope: 'world',
    config: false,
    default: CONST.USER_ROLES.GAMEMASTER,
    type: Number,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'PERMDescribe', {
    name: 'Permission Required to /describe and /note',
    scope: 'world',
    config: false,
    default: CONST.USER_ROLES.GAMEMASTER,
    type: Number,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'PERMNarrate', {
    name: 'Permission Required to /narrate',
    scope: 'world',
    config: false,
    default: CONST.USER_ROLES.GAMEMASTER,
    type: Number,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'PERMAs', {
    name: 'Permission Required to /as',
    scope: 'world',
    config: false,
    default: CONST.USER_ROLES.GAMEMASTER,
    type: Number,
  });

  // ========================================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'debug', {
    name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });

  const settings = defaultSettings();
  for (const [name, data] of Object.entries(settings)) {
    game.settings.register(CONSTANTS.MODULE_NAME, name, <any>data);
  }

  // for (const [name, data] of Object.entries(otherSettings)) {
  //     game.settings.register(CONSTANTS.MODULE_NAME, name, data);
  // }
};

class ResetSettingsDialog extends FormApplication<FormApplicationOptions, object, any> {
  constructor(...args) {
    //@ts-ignore
    super(...args);
    //@ts-ignore
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.content`) +
        '</p>',
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.confirm`),
          callback: async () => {
            await applyDefaultSettings();
            window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.cancel`),
        },
      },
      default: 'cancel',
    });
  }

  async _updateObject(event: Event, formData?: object): Promise<any> {
    // do nothing
  }
}

async function applyDefaultSettings() {
  const settings = defaultSettings(true);
  // for (const [name, data] of Object.entries(settings)) {
  //   await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
  // }
  const settings2 = otherSettings(true);
  for (const [name, data] of Object.entries(settings2)) {
    //@ts-ignore
    await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
  }
}

function defaultSettings(apply = false) {
  return {};
}

function otherSettings(apply = false) {
  return {
    debug: {
      name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
      scope: 'client',
      config: true,
      default: false,
      type: Boolean,
    },
  };
}
