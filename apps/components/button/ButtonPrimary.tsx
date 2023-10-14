import { Text } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import { BASE_COLOR } from "../../utilities/baseColor";

interface ButtonPrimaryTypes {
	title: string;
	onPress?: any;
	style?: any;
}

export const ButtonPrimary = ({ title, onPress, style }: ButtonPrimaryTypes) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				{
					backgroundColor: BASE_COLOR.primary,
					padding: 5,
					paddingHorizontal: 10,
					borderRadius: 15,
				},
				style,
			]}
		>
			<Text style={{ color: "#FFF", fontSize: 15 }}>{title}</Text>
		</TouchableOpacity>
	);
};
