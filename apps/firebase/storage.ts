import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../configs/firebase";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export class FirebaseStorage {
	public async pickImageFromStorage() {
		const result: any = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			base64: true,
			quality: 1,
		});

		if (result.canceled) return null;

		if (result.assets[0].base64.length > 4371340) {
			alert("maximum size 2MB");
			return;
		}

		return result.assets[0].uri;
	}

	public async getCompressImage(uri: string) {
		const result = await manipulateAsync(uri, [], {
			compress: 0.5,
			format: SaveFormat.JPEG,
		});
		return result;
	}

	public async getImageBolb(imageCompresseUri: string) {
		try {
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function () {
					resolve(xhr.response);
				};
				xhr.onerror = function (e) {
					console.log(e);
					reject(new TypeError("Network request failed"));
				};
				xhr.responseType = "blob";
				xhr.open("GET", imageCompresseUri, true);
				xhr.send(null);
			});

			return blob;
		} catch (error) {
			return error;
		}
	}

	public async uploadImage({ imageUri, fileName }: { imageUri: string; fileName: string }) {
		const compressedImage = await this.getCompressImage(imageUri);
		const imageBlob: any = await this.getImageBolb(compressedImage.uri);

		const imagePath = `payment/${fileName}_${Date.now()}.jpg`;
		const imageRef = ref(storage, imagePath);
		await uploadBytesResumable(imageRef, imageBlob);
		const uri = await getDownloadURL(imageRef).then((url) => url);
		return uri;
	}
}
