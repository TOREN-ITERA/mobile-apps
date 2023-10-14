export const generateDateTime = () => {
	const currentDateTime = new Date();
	return currentDateTime.toDateString();
};
