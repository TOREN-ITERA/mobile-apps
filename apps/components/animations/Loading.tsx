import React from "react";
import LottieView from "lottie-react-native";
import { View, Text } from "react-native";
import { BASE_COLOR } from "../../utilities/baseColor";

function LoadingAnimation() {
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
				style={{ width: 150, height: 150 }}
				source={require("../../../assets/animations/loading-secondary.json")}
				autoPlay
				loop={true}
			/>
			<Text
				style={{
					textAlign: "center",
					fontSize: 15,
					color: BASE_COLOR.text.primary,
				}}
			>
				Loading...
			</Text>
		</View>
	);
}

export default LoadingAnimation;
