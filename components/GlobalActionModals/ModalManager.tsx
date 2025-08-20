import React from 'react';
import { renderModal, RenderModalOptions } from './renderModal';

// Define the Modal type
type Modal = {
  id: string;
  render: () => React.ReactNode;
};

let count = 0;
const generateId = (): string => {
  // Remove Math.random() method due a Sonar Cube rule
  //return Math.random().toString(36).substring(2, 9);
  return (count++).toString(36);
};

class ModalManager {
  private static instance: ModalManager;
  private modals: Modal[] = [];
  private listeners: Set<() => void> = new Set();

  // Private constructor to enforce singleton pattern
  private constructor() {}

  // Get the singleton instance
  public static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }

  // Get all modals - return direct reference instead of creating a new array
  public getModals(): Modal[] {
    return this.modals;
  }

  // Open a new modal - create new array reference when adding modal
  public open(render: () => React.ReactNode): string {
    const id = generateId();
    this.modals = [...this.modals, { id, render }];
    this.notify();
    return id;
  }

  // Update a modal by ID
  public update(render: () => React.ReactNode) {
    this.modals = this.modals.map((modal) => {
      if (modal.id === this.modals[this.modals.length - 1].id) {
        return { ...modal, render };
      }
      return modal;
    });
    this.notify();
  }

  // Open a new confirm modal
  public confirm({ title, content, onOk }: RenderModalOptions) {
    this.open(() => renderModal({ title, content, onOk, onClose: () => this.close() }));
    this.notify();
  }

  // Open a new info modal
  public info({ title, content }: RenderModalOptions) {
    this.open(() => renderModal({ title, content, onClose: () => this.close() }));
    this.notify();
  }

  // Close a modal by ID, or the last one if no ID is provided
  public close(id?: string): void {
    if (id) {
      this.modals = this.modals.filter((modal) => modal.id !== id);
    } else if (this.modals.length > 0) {
      // Create new array reference when removing last modal
      this.modals = this.modals.slice(0, -1);
    }
    this.notify();
  }

  // Subscribe to changes
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners of changes
  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

// Export the singleton instance
export default ModalManager.getInstance();
