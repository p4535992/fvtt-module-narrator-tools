import CONSTANTS from './constants';
import { error } from './lib/lib';
import { NarratorTools } from './narrator';

const API = {
  async updateContentStyleArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('addActiveEffectOnTokenArr | inAttributes must be of type array');
    }
    const [style] = inAttributes;
    NarratorTools._updateContentStyle();
  },

  async updateContentStymatLine(style: string) {
    NarratorTools._updateContentStyle();
  },
};

export default API;
