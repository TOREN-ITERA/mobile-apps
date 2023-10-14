import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import { heightPercentage, widthPercentage } from "../../utilities/dimension";
import { Text } from "native-base";
import { BASE_COLOR } from "../../utilities/baseColor";

export default function NotInternetAnimation() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "#FFF",
			}}
		>
			<LottieView
				style={{ width: widthPercentage(80), height: heightPercentage(30) }}
				source={require("../../../assets/animations/no-internet.json")}
				autoPlay
				loop={true}
			/>
			<Text color={BASE_COLOR.text.primary} fontFamily="lato" fontSize="md">
				Opss.. Sepertinya kamu offline?
			</Text>
		</View>
	);
}
