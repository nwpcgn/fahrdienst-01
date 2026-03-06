// @index('./utils/**/*.ts', (f, _) => `export { default as ${_.camelCase(f.name)} } from '${f.path}${f.ext}'`)
export { default as copyToClip } from './utils/copyToClip.ts'
export { default as fetchData } from './utils/fetchData.ts'
export { default as isValidDate } from './utils/isValidDate.ts'
export { default as randRow } from './utils/randRow.ts'
export { default as sleep } from './utils/sleep.ts'
export { default as uuid } from './utils/uuid.ts'
// @endindex

// @index('./**/*.svelte', (f, _) => `export { default as ${_.pascalCase(f.name)} } from '${f.path}${f.ext}'`)
export { default as Alerts } from './Alerts.svelte'
export { default as Dialog } from './components/Dialog.svelte'
export { default as Logger } from './components/log/Logger.svelte'
export { default as Spinner } from './components/Spinner.svelte'
export { default as Sprites } from './components/Sprites.svelte'
export { default as Portal } from './components/util/Portal.svelte'
export { default as DetailItem } from './detailItem.svelte'
export { default as DetailItemInfo } from './detailItemInfo.svelte'
export { default as FahrerDetailsPage } from './fahrerDetailsPage.svelte'
export { default as FahrerHeaderPage } from './fahrerHeaderPage.svelte'
export { default as IconView } from './IconView.svelte'
export { default as TourEnde } from './tourEnde.svelte'
export { default as TourReset } from './tourReset.svelte'
// @endindex
import {
	routeStore,
	routeLength,
	uid,
	rhId,
	tourId,
	fid,
	fro,
	fahrer,
	alertList
} from './storage'
export {
	routeStore,
	routeLength,
	uid,
	rhId,
	tourId,
	fid,
	fro,
	fahrer,
	alertList
}
export const nav = [
	{
		href: '/',
		name: 'Lobby',
		icon: 'fd-start',
		hidden: true,
		slug: 'lobby',
		disabled: 1
	},
	{
		href: '/dienst',
		name: 'Fahrdienst',
		icon: 'fd-car',
		hidden: false,
		slug: 'dienst',
		disabled: 3
	},
	{
		href: '/info',
		name: 'Fahrinfo',
		icon: 'fd-info',
		hidden: false,
		slug: 'info',
		disabled: 1
	},
	{
		href: '/suche',
		name: 'Suche',
		icon: 'fd-search',
		hidden: false,
		slug: 'suche',
		disabled: 1
	}
]

import type { Tour, TourStop } from './types'

export const settings = {
	AUTH_URL: 'https://lab-quade.de/fahrdienst_app/tour_auth.php',
	ALERT_URL: 'https://lab-quade.de/fahrdienst_app/tour_nachricht.php',
	ALERT_INTERVAL: 30,
	SEARCH_URL: 'https://lab-quade.de/fahrdienst_app/tour_einsender_auskunft.php',
	SEARCH_MIN: 4,
	fahrer: {
		header: {
			url: 'https://lab-quade.de/fahrdienst_app/tour_header.php',
			template: 'headerListF',
			getKeys: ['uid', 'datum'],
			postKeys: ['uid', 'json_input'],
			postJson: ['RH_ID', 'inuse', 'Fahrer_id', 'history']
		},
		detail: {
			url: 'https://lab-quade.de/fahrdienst_app/tour_detail.php',
			template: 'detailListF',
			getKeys: ['uid', 'tour_id'],
			postKeys: ['uid', 'json_input'],
			postJson: [
				'RH_ID',
				'befunde',
				'material',
				'proben',
				'Fahrer_ID',
				'erledigt_um'
			]
		}
	},
	admin: {
		header: {
			url: 'https://lab-quade.de/fahrdienst_app/tour_header_admin.php',
			template: 'headerListA',
			getKeys: ['uid', 'datum'],
			getJson: {
				datum: 'searchDatum'
			}
		},
		detail: {
			url: 'https://lab-quade.de/fahrdienst_app/tour_detail_admin.php',
			template: 'detailListA',
			getKeys: ['uid', 'tour_id']
		}
	}
}
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

export const adminTourType = [
	['Frei', 'badge-success'],
	['In Arbeit', 'badge-warning'],
	['Leer', ''],
	['Beendet', 'badge-neutral']
]
export const fetchHeaderGet = {
	method: 'GET',
	mode: 'cors'
}
export const fetchHeaderPost = {
	'Content-Type': 'application/x-www-form-urlencoded'
}
export const getHeader = async (url: string): Tour[] => {
	try {
		// console.log(url) // 'https://lab-quade.de/fahrdienst_app/tour_header.php?uid=e511dc6d6f5009dca62724a45f8e17c1&datum=2026-02-02'
		const response = await fetch(url, fetchHeaderGet)

		if (!response.ok) {
			throw new Error(`HTTP-Fehler! Status: ${response.status}`)
		}

		const { data, error } = await response.json()

		if (error) {
			console.log('Error', error)
			throw new Error(error)
		}

		if (data) {
			// console.log('Data', data)
			return data
		}

		// const contentType = response.headers.get('content-type')

		// if (contentType && contentType.includes('application/json')) {
		// 	// const data = await response.json()
		// 	// const tourenData = data.routen_kopf_daten ?? data
		// 	return response.json()
		// } else {
		// 	return response.text()
		// }
	} catch (error) {
		console.error('Fehler beim Abrufen der Daten:', error)
		throw new Error(error)
	}
}

export const getDetail = async (url: string): TourStop[] => {
	try {
		// console.log('Get Detail', url)
		const response = await fetch(url, {
			method: 'GET', // Standardmäßig GET
			mode: 'cors' // Explizit auf CORS setzen
		})

		// Prüfen, ob die HTTP-Antwort okay ist (Status 200-299)
		if (!response.ok) {
			throw new Error(`HTTP-Fehler! Status: ${response.status}`)
		}

		// Daten als JSON parsen
		const { data, error } = await response.json()

		if (error) {
			console.log('Error', error)
			throw new Error(error)
		}

		if (data) {
			// console.log('Data', data)
			return data
		}
	} catch (error) {
		console.error('Fehler beim Abrufen der Daten:', error)
		throw new Error(error)
	}
}

export const pageAdapt = {
	'/': { name: 'Lobby', icon: 'fd-start' },
	'/dienst': { name: 'Fahrdienst', icon: 'fd-car' },
	'/info': { name: 'Fahrinfo', icon: 'fd-info' },
	'/suche': { name: 'Suche', icon: 'fd-search' }
}
