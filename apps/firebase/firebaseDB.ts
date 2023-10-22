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
  onSnapshot,
} from "firebase/firestore";
import { firebaseConfigs } from "../configs";

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
    return doc(firebaseConfigs.dataBase, this.collectionName, documentId);
  }

  private getCollectionPath() {
    return collection(firebaseConfigs.dataBase, this.collectionName);
  }

  private extractData(snapshoot: any) {
    const data: any[] = [];
    snapshoot.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    return data;
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

  public async setDocument({
    documentId,
    data,
  }: {
    documentId: string;
    data: any;
  }) {
    try {
      await setDoc(this.getDocumentPath(documentId), data);
      return this;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  public async setDocumentWithGeneratedId({ data }: { data: any }) {
    try {
      await setDoc(
        doc(collection(firebaseConfigs.dataBase, this.collectionName)),
        data
      );
      return this;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  public async getDocument({ documentId }: { documentId: string }) {
    try {
      const docSnap = await getDoc(this.getDocumentPath(documentId));
      if (!docSnap.exists()) throw Error("No such document!");
      return docSnap.data();
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  public async getDocumentCollection() {
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

  public async queryDocumentCollection({
    params_1,
    params_2,
  }: QueryParamsTypes) {
    try {
      const collectionPath = this.getCollectionPath();
      const queryParams = query(
        collectionPath,
        where(params_1, "==", params_2)
      );
      const querySnapshot = await getDocs(queryParams);
      const result = this.extractData(querySnapshot);
      return result;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  public async updateDocument({
    documentId,
    newData,
  }: {
    documentId: string;
    newData: any;
  }) {
    try {
      await updateDoc(this.getDocumentPath(documentId), newData);
      return this;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  public getRealtimeData({
    documentId,
    getData,
  }: {
    documentId: string;
    getData: (value: any) => any;
  }) {
    const unsub = onSnapshot(this.getDocumentPath(documentId), (doc) => {
      getData(doc.data());
      console.log("Current data: ", doc.data());
    });
    return unsub;
  }
}
