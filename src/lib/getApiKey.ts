import CryptoJS from 'crypto-js'
const APIURL1 = 'https://lab-quade.de/fahrdienst_app/tour_header_2.php'
// const APIURL2 = 'https://lab-quade.de/fahrdienst_app/tour_detail_2.php'
function getApiKey() {
	const prefix = 'LabQ'
	const postfix = 'GHM'
	const now = new Date()
	const day = String(now.getDate()).padStart(2, '0')
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const year = now.getFullYear()
	const dateStr = `${day}.${month}.${year}.`
	const input = `${prefix}${dateStr}${postfix}`
	const key = CryptoJS.MD5(input).toString()
	const datum = `${year}-${month}-${day}`
	const url = `${APIURL1}?uid=${key}&datum=${datum}`
	return { key, datum, url }
}
export default getApiKey
