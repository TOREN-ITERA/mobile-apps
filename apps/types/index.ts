export interface NotificationsTypes {
	id: string;
	message: string;
	createdAt: string;
}

export interface TransactionHistoryTypes {
	id: string;
	price: number;
	coin: number;
	createdAt: string;
	status: "succsess" | "fail";
}

export interface UserInfoTypes {
	isAuth?: boolean;
	name: string;
	email: string;
	password: string;
	deviceId?: string;
	referralCode?: string;
	coin: number;
	notifications: NotificationsTypes[];
	waitingListTransaction: string[];
	transactionHistory: TransactionHistoryTypes[];
}

export interface PriceTypes {
	id: string;
	totalCoin: number;
	totalPrice: number;
	discount: number;
}

export interface PaymentTypes {
	paymentMethods: string[];
	priceList: PriceTypes[];
	message: string;
	totalCoinReferral: number;
	totalCoinAds: number;
	totalFreeCoin: number;
}

export interface BannerTypes {
	countDown: string;
}

export interface tryOutSettings {
	categories: string[];
	cacheExpireTimeInMinute?: number;
}

export interface learningModuleSettings {
	cacheExpireTimeInMinute?: number;
}

export interface AppInfoTypes {
	banner: BannerTypes;
	payment: PaymentTypes;
	maintenanceMode: boolean;
	appVersion: number;
	tryOutSettings: tryOutSettings;
	learningModuleSettings: learningModuleSettings;
}

export interface ContextApiTypes {
	userInfo: UserInfoTypes;
	appInfo: AppInfoTypes;
}
