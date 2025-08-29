export interface ActionTriggerPayload {
  icon?: string;
  name?: string;
  data?: Record<string, unknown>;
  routingType?: 'internal' | 'modal' | 'custom';
  routingUri?: 'internal' | 'modal' | 'custom';
  customContent?: unknown;
}

export interface ActionOptions {
  router?: { push: (href: string) => void };
  callback?: () => void;
}

export type UseGlobalAction = {
  doAction: (payload: ActionTriggerPayload, options?: ActionOptions) => void;
};

export class GlobalActionHandler {
  private static instance: GlobalActionHandler;

  public static getInstance(): GlobalActionHandler {
    if (!GlobalActionHandler.instance) {
      GlobalActionHandler.instance = new GlobalActionHandler();
    }
    return GlobalActionHandler.instance;
  }
}
