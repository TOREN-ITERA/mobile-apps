import React, { useEffect, useState } from "react";
import AppNavigations from "./apps/navigations";
import { NativeBaseProvider, extendTheme, Spinner } from "native-base";
import { StatusBar, Text, View } from "react-native";
import { RootContext } from "./apps/utilities/rootContext";
import { AppInfoTypes, UserInfoTypes } from "./apps/types";
import { useFonts } from "expo-font";
import NetInfo from "@react-native-community/netinfo";
import { onAuthStateChanged } from "firebase/auth";

import { LogBox } from "react-native";
import _ from "lodash";
import { auth } from "./apps/configs/firebase";
import NotInternetAnimation from "./apps/components/animations/Ofline";
import LoadingAnimation from "./apps/components/animations/Loading";
import { FirestoreDB } from "./apps/firebase/firebaseDB";
import MaintenanceAnimation from "./apps/components/animations/Maintenance";
import { BASE_COLOR } from "./apps/utilities/baseColor";

import "expo-dev-client";

LogBox.ignoreLogs(["Warning:..."]); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);
console.warn = (message) => {
	if (message.indexOf("Setting a timer") <= -1) {
		_console.warn(message);
	}
};

// Define the config
const config = {
	useSystemColorMode: false,
	initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module "native-base" {
	interface ICustomTheme extends MyThemeType {}
}

export default function App() {
	const [userInfo, setUserInfo] = useState<UserInfoTypes>();
	const [appInfo, setAppInfo] = useState<AppInfoTypes>();

	const [isOffline, setIsOffLine] = useState<any>(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
			const offline = !(state.isConnected && state.isInternetReachable);
			setIsOffLine(offline);
		});
		return () => removeNetInfoSubscription();
	}, []);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			(async () => {
				if (user) {
					const userDb = new FirestoreDB("User");
					const userData: UserInfoTypes = await userDb.get({ documentId: user.email! });
					userData.isAuth = true;
					setUserInfo(userData);
				}

				if (!user) {
					const userData: UserInfoTypes = {
						isAuth: false,
						email: "",
						name: "",
						coin: 0,
						notifications: [],
						waitingListTransaction: [],
						transactionHistory: [],
					};
					setUserInfo(userData);
				}

				const appInfoDB = new FirestoreDB("AppInfo");
				const appData = await appInfoDB.get({ documentId: "general" });
				setAppInfo(appData);
				setIsLoading(false);
			})();
		});
	}, []);

	const [loaded] = useFonts({
		lora: require("./assets/Font/Lora-VariableFont_wght.ttf"),
		lato: require("./assets/Font/Lato-Black.ttf"),
	});

	if (!loaded) {
		return null;
	}

	if (isLoading)
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#FFF",
				}}
			>
				<Text style={{ color: BASE_COLOR.text.primary }}>Loading...</Text>
				<StatusBar barStyle="default" backgroundColor="#FFF" />
			</View>
		);

	if (appInfo?.maintenanceMode) return <MaintenanceAnimation />;

	return (
		<NativeBaseProvider>
			<RootContext.Provider value={{ userInfo, setUserInfo, appInfo }}>
				{isOffline ? <NotInternetAnimation /> : <AppNavigations />}
				<StatusBar barStyle="default" backgroundColor="#FFF" />
			</RootContext.Provider>
		</NativeBaseProvider>
	);
}
