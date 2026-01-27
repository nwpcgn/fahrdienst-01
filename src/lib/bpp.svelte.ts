import fetchData from './utils/fetchData'
import sleep from './utils/sleep'
import type { Tour, TourStop } from './types'
import getApiKey from './getApiKey'
import log from './components/log/log.svelte'
const logText = (
	message: string,
	type: string = 'info',
	timeout: number = 5000
) => {
	console.log(message, type)
	log.add({ message, type, timeout })
}
class Fahrdienst {
	APIURL1: string = 'https://lab-quade.de/fahrdienst_app/tour_header_2.php'
	APIURL2: string = 'https://lab-quade.de/fahrdienst_app/tour_detail_2.php'
	key: string = $state('')
	datum: string = $state('')
	url1: string = $state('')
	name: string = $state('')
	fahrer: string = $state('')
	boxen: number = $state(0)
	tourId: number = $state(0)
	detailUrl: string = $derived(
		`${this.APIURL2}?uid=${this.key}&tour_id=${this.tourId}`
	)
	routeList: Tour[] = $state(null)
	tourList: TourStop[] = $state(null)
	constructor() {
		this.init()
	}

	reset() {
		this.key = ''
		this.datum = ''
		this.url1 = ''
		this.name = ''
		this.fahrer = ''
		this.boxen = 0
		this.tourId = 0
		this.routeList = null
		this.tourList = null
	}

	info() {
		return {
			key: this.key,
			datum: this.datum,
			url1: this.url1,
			name: this.name,
			fahrer: this.fahrer,
			boxen: this.boxen,
			tourId: this.tourId
		}
	}

	async setTour(value: Tour) {
		this.name = value.Routenname
		this.fahrer = value.Fahrer
		this.boxen = value.Boxen
		this.tourId = value.RH_ID
		if (this.detailUrl) {
			await this.getData(this.detailUrl)
			await sleep()
			logText('App started')
			return true
		}
	}

	init() {
		const { key, datum, url } = getApiKey()
		this.key = key
		this.datum = datum
		this.url1 = url
		this.getTouren()
	}

	async getData() {
		try {
			const { routen_detail_daten } = await fetchData(
				'./data/routen_detail_daten.json'
			)

			if (routen_detail_daten) {
				// this.routeList = routen_kopf_daten
				// Routentyp, Routenname, Fahrer, Boxen, RH_ID
				this.tourList = routen_detail_daten
				return routen_detail_daten
			}
			throw new Error('Error fetching Touren List')
		} catch (error) {
			console.log('ERROR', error)
		}
	}

	async getTouren() {
		try {
			const { routen_kopf_daten } = await fetchData(
				'./data/routen_kopf_daten.json'
			)

			if (routen_kopf_daten) {
				this.routeList = routen_kopf_daten
				// Routentyp, Routenname, Fahrer, Boxen, RH_ID
				return routen_kopf_daten
			}
			throw new Error('Error fetching Touren List')
		} catch (error) {
			console.log('ERROR', error)
		}
	}
}
export const app = new Fahrdienst()

export const tourType = [
	null,
	{
		name: 'Vormittag',
		icon: 'fd-sun',
		slug: 'Früh',
		label: 'info'
	},
	{
		name: 'Nachmittag',
		icon: 'fd-moon',
		slug: 'Spät',
		label: 'error'
	},
	{
		name: 'Sonder',
		icon: 'fd-car',
		slug: 'Sonder',
		label: 'warning'
	}
]
