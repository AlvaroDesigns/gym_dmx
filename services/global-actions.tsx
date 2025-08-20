export interface ActionTriggerPayload {
  icon?: string;
  name?: string;
  data?: Record<string, any>;
  routingType?: RoutingType['routingType'];
  routingUri?: RoutingType['routingUri'];
  customContent?: RoutingType['customContent'];
}

export const MANAGE_EVENT: Record<string, string> = {
  ADDRESS: 'manageAddress',
  BENEFICIARIES: 'manageBeneficiaries',
  BANK_ACCOUNT: 'manageBankAccount',
  CONTRIBUTIONS: 'manageContributions',
  EMAIL: 'manageEmail',
  EXCHANGE_FUNDS: 'manageProductGeneralChangeFunds',
  FORMALIZATION: 'manageFormalization',
  PHONE: 'managePhone',
  PROFESSION: 'manageProfession',
  FATCA: 'manageFatca',
  KYC: 'manageKYC',
  PAY_DAY: 'managePayDay',
  PAYMENT_FREQUENCY: 'managePaymentFrequency',
  RECEIPTS: 'manageReceipts',
  RESPONSE: 'response',
  CLOSE_WEBVIEW: 'close_webview',
  ACKNOWLEDGED: 'acknowledged',
  WITHDRAWAL: 'manageWithdrawal',
  ALREADY_REQUESTED: 'already_requested',
  UPDATE_DNI: 'manageUpdateDni',
  CUSTOM_ERROR: 'custom_error',
  FILE_SHARED: 'manageFileShared',
};

export interface ActionOptions {
  router?: AnyRouter;
  callback?: () => void;
}

type ActionItems = {
  [key: string]: { type: string; allow: boolean; data?: Record<string, any> };
};

type GlobalStoreRecords = {
  [key: string]: any;
};

type SendMessagePayload = {
  id: string;
  type: string;
  token: string;
  authType?: string;
  data: Record<string, any>;
};

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

  private profileDataFromStore(
    globalStore: GlobalStoreRecords,
  ): Record<string, any> | undefined {
    const { profile } = globalStore;
    if (!profile) return undefined;
    return {
      customerId: profile?.customerId,
      dni: profile?.nif,
      email: profile?.mail,
    };
  }
}
