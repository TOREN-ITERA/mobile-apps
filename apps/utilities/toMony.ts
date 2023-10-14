/**
 * Digunakan untuk mengubah format angka menjadi format mata uang
 * @param money
 * @param currency
 * @returns
 */
export const toMoney = (money: any, currency: string = ""): string => {
	money = Math.floor(money);
	return (
		(currency ? currency : "") +
		(!money ? "0" : money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")) +
		""
	);
};
