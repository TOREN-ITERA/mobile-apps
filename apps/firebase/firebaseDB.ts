import {
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
	query,
	where,
	increment,
	arrayRemove,
	arrayUnion,
} from "firebase/firestore";
import { DB } from "../configs/firebase";
import { TryOutDataTypes } from "../types/tryOutDataTypes";

interface QueryParamsTypes {
	params_1: string;
	params_2: any;
}

export class FirestoreDB {
	private collectionName: string;

	constructor(collectionName: string) {
		this.collectionName = collectionName;
	}

	private getDocumentPath(documentId: string) {
		return doc(DB, this.collectionName, documentId);
	}

	private getCollectionPath() {
		return collection(DB, this.collectionName);
	}

	public incrementValue(value: number) {
		return increment(value);
	}

	public pushArray(value: any) {
		return arrayUnion(value);
	}

	public removeArray(value: any) {
		return arrayRemove(value);
	}

	private extractData(snapshoot: any) {
		const data: TryOutDataTypes[] = [];
		snapshoot.forEach((doc: any) => {
			data.push({ ...doc.data(), id: doc.id });
		});
		return data;
	}

	public async set({ documentId, data }: { documentId: string; data: any }) {
		try {
			await setDoc(this.getDocumentPath(documentId), data);
			return this;
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async get({ documentId }: { documentId: string }) {
		try {
			const docSnap = await getDoc(this.getDocumentPath(documentId));
			if (!docSnap.exists()) throw Error("No such document!");
			return docSnap.data();
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async getCollection() {
		try {
			const collectionPath = this.getCollectionPath();
			const querySnapshot = await getDocs(collectionPath);
			const result = this.extractData(querySnapshot);
			return result;
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async queryCollection({ params_1, params_2 }: QueryParamsTypes) {
		try {
			const collectionPath = this.getCollectionPath();
			const queryParams = query(collectionPath, where(params_1, "==", params_2));
			const querySnapshot = await getDocs(queryParams);
			const result = this.extractData(querySnapshot);
			return result;
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}

	public async update({ documentId, newData }: { documentId: string; newData: any }) {
		try {
			await updateDoc(this.getDocumentPath(documentId), newData);
			return this;
		} catch (error: any) {
			console.log(error);
			return error;
		}
	}
}
