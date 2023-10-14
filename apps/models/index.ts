export enum COLLECTION {
  USERS = 'USERS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  DEVICES = 'DEVICES',
  APP = 'APP'
}

export interface INotificationModel {
  notificationId: string
  notificationMessage: string
  notificationCreatedAt: string
}

export interface IDeviceModel {
  deviceId: string
  deviceName: string
  deviceStatus: boolean
}

export interface IUserModel {
  userId: string
  userAuthentication: boolean
  userName: string
  userEmail: string
  userPassword: string
  userDeviceId?: string
}

export interface IAppModel {
  appId: string
  appMaintenanceMode: boolean
  appVersion: number
}

export interface IContextApiModel {
  user: IUserModel
  app: IAppModel
}
