export enum COLLECTION {
  USERS = "USERS",
  NOTIFICATIONS = "NOTIFICATIONS",
  DEVICES = "DEVICES",
  HISTORY = "HISTORY",
  APP = "APP",
}

export interface INotificationModel {
  notificationId: string;
  notificationMessage: string;
  notificationCreatedAt: string;
}

export interface IDeviceModel {
  deviceWaterFlowProgress: number;
  deviceCurrentSensor: number;
  deviceConnectionType: string;
  deviceId: string;
  deviceInternetStatus: boolean;
  deviceStatus: boolean;
  deviceWaterLevelStatus: boolean;
  deviceWaterPumpProgress: number;
  deviceWaterPumpStatus: boolean;
}

export interface IUserModel {
  userId: string;
  userAuthentication: boolean;
  userName: string;
  userEmail: string;
  userPassword: string;
  userDeviceId?: string;
}

export interface IAppModel {
  appId: string;
  appMaintenanceMode: boolean;
  appVersion: number;
}

export interface IHistoryModel {
  historyId: string;
  historyMessage: string;
  historyCreatedAt: string;
}

export interface IContextApiModel {
  user: IUserModel;
  app: IAppModel;
}
