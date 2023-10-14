import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveDataToLocalStorage = async ({ key, item }: { key: string; item: any }) => {
	try {
		const data = JSON.stringify(item);
		await AsyncStorage.setItem(key, data);
	} catch (error: any) {
		console.log(error);
		return error;
	}
};

export const getDataFromLocalStorage = async ({ key }: { key: string }) => {
	try {
		const result = await AsyncStorage.getItem(key);
		return result != null ? JSON.parse(result) : null;
	} catch (error: any) {
		console.log(error);
		return error;
	}
};

export const removeDataFromLocalStorage = async ({ key }: { key: string }) => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (error: any) {
		console.log(error);
		return error;
	}
};

export const setExpireTimeToLocalStorage = async ({ time, key }: { time: number; key: string }) => {
	const timeInMilliSecond = 60000;
	const timeInMinute = timeInMilliSecond * time;
	const expireUntile = timeInMinute;

	const currentDateTimeInMilliSecond = Date.now() + expireUntile + "";
	await AsyncStorage.setItem(key, currentDateTimeInMilliSecond);
};

export const getExpireTimeFromLocalStorage = async ({ key }: { key: string }) => {
	const result = await AsyncStorage.getItem(key);
	return result != null ? JSON.parse(result) : 0;
};
