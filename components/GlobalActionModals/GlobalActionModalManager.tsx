import { ReactNode } from 'react';
import ModalManager from './ModalManager';

class GlobalActionModalManager {
  private modals: { [key: string]: (props: any) => ReactNode } = {};
  private openModals: Set<string> = new Set();

  public registerModals(modals: { [key: string]: (props: any) => ReactNode }) {
    this.modals = { ...modals };
  }

  public open(key: string, props: { [prop: string]: any }) {
    if (!this.modals[key])
      throw new Error(
        `Custom Modal ${key} is not defined, did you set with ModalManager.setCustomModals?`,
      );

    const modal = this.modals[key](props);

    this.openModals.add(key);

    return ModalManager.open(() => modal);
  }

  public isOpen(key?: string) {
    if (key) {
      return this.openModals.has(key);
    }
  }
}

export default new GlobalActionModalManager();
