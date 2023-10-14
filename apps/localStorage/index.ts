import AsyncStorage from "@react-native-async-storage/async-storage";

export class LocalStorage {
	private key: string;
	private primaryKey: number = Date.now();

	public constructor(keyValue: string) {
		this.key = keyValue;
	}

	private checkInput(input: any[]) {
		try {
			if (!Array.isArray(input)) throw Error("data must be an array");
			input.forEach((data) => {
				if (typeof data !== "object") throw Error("data must be and obejct of array [{}]");
			});
			return false;
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async getAllKeys() {
		try {
			const keys = await AsyncStorage.getAllKeys();
			return keys;
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async setItem(item: any) {
		try {
			const data = JSON.stringify(item);
			await AsyncStorage.setItem(this.key, data);
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async getItem() {
		try {
			const result = await AsyncStorage.getItem(this.key);
			return result != null ? result : null;
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async remove() {
		try {
			await AsyncStorage.removeItem(this.key);
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async store(values: any[]) {
		if (values.length === 0) return;
		const isInputInvalid = this.checkInput(values);
		if (isInputInvalid) return;

		try {
			const dataWithPrimaryKey = values.map((value) => ({ id: this.primaryKey, ...value }));
			const keys: string[] = await this.getAllKeys();

			if (keys.includes(this.key)) {
				const previousData = await this.get();
				const newData = JSON.stringify([...previousData, ...dataWithPrimaryKey]);
				await AsyncStorage.setItem(this.key, newData);
				return newData;
			}

			const data = JSON.stringify(dataWithPrimaryKey);
			await AsyncStorage.setItem(this.key, data);
			return data;
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async get() {
		try {
			const jsonValue = await AsyncStorage.getItem(this.key);
			return jsonValue != null ? JSON.parse(jsonValue) : null;
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async update(id: number, newData: any) {
		try {
			if (typeof newData !== "object") throw Error("value must be and object");

			const previousData: any[] = await this.get();
			if (previousData?.length === 0) throw Error("data not found");
			const index = previousData.findIndex((data) => data.id === id);
			if (index === -1) throw Error("id not found!");

			previousData[index] = { id, ...newData };
			this.remove();
			this.store(previousData);
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	static async clearAll() {
		try {
			await AsyncStorage.clear();
			return "clear success";
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}
}
