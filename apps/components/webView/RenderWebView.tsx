import { WebView } from "react-native-webview";
import { memo, useState } from "react";
import { BASE_COLOR } from "../../utilities/baseColor";

const RenderWebView = ({ htmlBody }: { htmlBody: string }) => {
	const HTML = `
    <!doctype html>
    <html lang="en">
        <head>  
            <meta charset="utf-8">
            <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
        </head>
        <body style="color:${BASE_COLOR.text.primary}; padding: 5px; font-family:lora; line-height: 25px; text-align: justify;">${htmlBody}</body>
    </html>`;

	const [webViewHeight, setwebViewHeight] = useState(0);

	const onWebViewMessage = (event: any) => {
		setwebViewHeight(Number(event.nativeEvent.data));
	};

	return (
		<WebView
			injectedJavaScript="document.body.style.userSelect = 'none'; window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
			showsHorizontalScrollIndicator={false}
			automaticallyAdjustContentInsets
			javaScriptEnabled
			showsVerticalScrollIndicator={false}
			originWhitelist={["*"]}
			source={{ html: HTML }}
			style={{ height: webViewHeight, backgroundColor: BASE_COLOR.blue[50] }}
			onMessage={onWebViewMessage}
		/>
	);
};

export default memo(RenderWebView);
