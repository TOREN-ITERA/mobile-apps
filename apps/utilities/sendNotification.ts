import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { DB } from "../configs/firebase";
import { NotificationsTypes } from "../types";

export interface SendNotificationTypes {
	docomentID: string;
	message: NotificationsTypes;
}

export const sendNotification = async ({ docomentID, message }: SendNotificationTypes) => {
	const currentDateTime = new Date();
	const UserDBRef = doc(DB, "User", docomentID);

	await updateDoc(UserDBRef, {
		notifications: arrayUnion({ ...message, createdAt: currentDateTime.toDateString() }),
	});
};
