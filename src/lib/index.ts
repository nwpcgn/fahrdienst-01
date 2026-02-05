// @index('./utils/**/*.ts', (f, _) => `export { default as ${_.camelCase(f.name)} } from '${f.path}${f.ext}'`)
export { default as copyToClip } from './utils/copyToClip.ts'
export { default as fetchData } from './utils/fetchData.ts'
export { default as randRow } from './utils/randRow.ts'
export { default as sleep } from './utils/sleep.ts'
export { default as uuid } from './utils/uuid.ts'
// @endindex

// @index('./**/*.svelte', (f, _) => `export { default as ${_.pascalCase(f.name)} } from '${f.path}${f.ext}'`)
export { default as Dialog } from './components/Dialog.svelte'
export { default as List } from './components/List.svelte'
export { default as ListItem } from './components/ListItem.svelte'
export { default as Logger } from './components/log/Logger.svelte'
export { default as Page } from './components/Page.svelte'
export { default as Spinner } from './components/Spinner.svelte'
export { default as Sprites } from './components/Sprites.svelte'
export { default as StackList } from './components/StackList.svelte'
export { default as Portal } from './components/util/Portal.svelte'
// @endindex

export const nav = [
	{
		slug: 'start',
		href: '/start',
		name: 'Start',
		icon: 'fd-route'
	},
	{
		slug: 'tour',
		href: '/tour',
		name: 'Tour',
		icon: 'fd-map'
	},
	{
		slug: 'info',
		href: '/info',
		name: 'Info',
		icon: 'fd-info'
	}
]

import type { Tour, TourStop } from './types'

export const getHeader = async (url: string): Tour[] => {
	try {
		console.log(url) // 'https://lab-quade.de/fahrdienst_app/tour_header_2.php?uid=e511dc6d6f5009dca62724a45f8e17c1&datum=2026-02-02'
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors'
		})

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
		throw new Error('Fetch Error: ' + error)
	}
}

export const getDetail = async (url: string): TourStop[] => {
	try {
		console.log('Get Detail', url)
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
