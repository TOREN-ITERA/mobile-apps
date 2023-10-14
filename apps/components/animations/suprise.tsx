import React from "react";
import LottieView from "lottie-react-native";
import { View, Text } from "react-native";
import { BASE_COLOR } from "../../utilities/baseColor";

function SupriseAnimation({ title = "Selamat" }: { title?: string }) {
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
				style={{ width: 200, height: 200 }}
				source={require("../../../assets/animations/surprise.json")}
				autoPlay
				loop={true}
				duration={2000}
			/>
			<Text
				style={{
					textAlign: "center",
					fontSize: 20,
					color: BASE_COLOR.text.primary,
				}}
			>
				{title}
			</Text>
		</View>
	);
}

export default SupriseAnimation;
