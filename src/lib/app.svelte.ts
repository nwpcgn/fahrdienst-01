import fetchData from './utils/fetchData'
import sleep from './utils/sleep'
import type { Tour, TourStop } from './types'
import getApiKey from './getApiKey'

class Fahrdienst {
	APIURL1: string = 'https://lab-quade.de/fahrdienst_app/tour_header_2.php'
	APIURL2: string = 'https://lab-quade.de/fahrdienst_app/tour_detail_2.php'
	apiKey: string = $state('')
	apiDatum: string = $state('')
	tourUrl: string = $state('')
	routeList: Tour[] = $state(null)
	tourList: TourStop[] = $state()
	tourId: string = $state('')
	activeTour: Tour = $state(null)
	detailUrl: string = $derived(
		`${this.APIURL2}?uid=${this.apiKey}&tour_id=${this.tourId}` || null
	)
	constructor() {
		this.init()
	}

	info() {
		return {
			key: this.apiKey,
			datum: this.apiDatum,
			tour: this.activeTour
		}
	}

	async setTour(value: Tour) {
		this.tourId = value?.RH_ID
		this.activeTour = { ...value }
		if (this.detailUrl) {
			await this.getData(this.detailUrl)
			await sleep()
			return true
		}
	}

	init() {
		const { key, datum, url } = getApiKey()
		console.log({ key, datum })
		this.apiKey = key
		this.apiDatum = datum
		this.tourUrl = url
		this.getTouren()
	}

	async getData() {
		try {
			const { routen_detail_daten } = await fetchData(
				'/data/routen_detail_daten.json'
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
				'/data/routen_kopf_daten.json'
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
