import React from "react";
import LottieView from "lottie-react-native";
import { View, Text, StatusBar } from "react-native";
import { BASE_COLOR } from "../../utilities/baseColor";
import { widthPercentage } from "../../utilities/dimension";

function MaintenanceAnimation() {
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
				style={{ width: 250, height: 250, marginRight: widthPercentage(20) }}
				source={require("../../../assets/animations/maintenance-web.json")}
				autoPlay
				loop={true}
			/>
			<Text
				style={{
					textAlign: "center",
					fontSize: 20,
					color: BASE_COLOR.text.primary,
				}}
			>
				Sedang dalam perbaikan!
			</Text>
			<StatusBar barStyle="default" backgroundColor="#FFF" />
		</View>
	);
}

export default MaintenanceAnimation;
