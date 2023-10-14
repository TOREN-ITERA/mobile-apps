import { View } from "native-base";
import React, { PropsWithChildren } from "react";
import { BASE_COLOR } from "../utilities/baseColor";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<View flex={1} px={2} backgroundColor={BASE_COLOR.blue[50]}>
			{children}
		</View>
	);
};

export default Layout;
