import type { Tour, TourStop } from './types'
import CryptoJS from 'crypto-js'
import { get } from 'svelte/store'
import getApiKey from './getApiKey'
import {
	fetchHeaderGet,
	settings,
	uid,
	fid,
	fahrer,
	fro,
	rhId,
	fetchHeaderPost
} from './'
export const getHeaderGet = async (url: string): Tour[] => {
	try {
		const response = await fetch(url, fetchHeaderGet)
		if (!response.ok) {
			throw new Error(`HTTP-Fehler! Status: ${response.status}`)
		}
		const { data, error } = await response.json()

		if (data) {
			console.log(`Routen Liste wurden geladen: ${data.length} rows`)
			console.log(data[0])
			return data
		}

		if (error) {
			console.log('Error Header-Data', error)
			throw new Error(error)
		}
	} catch (error) {
		console.error('Fehler beim Abrufen der Daten:', error)
	}
}
export const getDetailGet = async (url: string): TourStop[] => {
	try {
		const response = await fetch(url, fetchHeaderGet)
		if (!response.ok) {
			throw new Error(`HTTP-Fehler! Status: ${response.status}`)
		}
		const { data, error } = await response.json()

		if (data) {
			console.log(
				`Details Tour ${get(rhId) || ''} wurden geladen: ${data.length} rows`
			)
			return data
		}
		if (error) {
			console.log('Error Detail-Data', error)
		}
	} catch (error) {
		console.error('Fehler beim Abrufen der Detail-Daten:', error)
	}
}

export const userAnmelden = async (username: string, password: string) => {
	if (!username || !password) {
		alert('Zu wenig Input')
		return
	}
	const uidex = get(uid)
	const key = CryptoJS.MD5(password).toString()
	const uri = `${settings.AUTH_URL}?uid=${uidex}&user=${username}&pw=${key}`

	try {
		const req = await fetch(uri)
		const { error, data } = await req.json()
		if (data) {
			const id = data?.user_id
			console.log(`User ${id} wurde angemeldet`)
			fahrer.set(username)
			fid.set(data?.user_id)
			fro.set(data?.user_rolle)
		}

		if (error) {
			console.log('Anmeldung nicht erfolgreich')
			throw new Error('Anmeldung nicht erfolgreich')
		}
	} catch (error) {
		console.log(error)
		alert(error)
	}
}

export const selectRoute = async (RH_ID: number) => {
	const { key, datum, time } = getApiKey()
	const fahrerId = get(fid)
	const formData = new URLSearchParams()
	formData.append('uid', key)
	formData.append(
		'json_input',
		JSON.stringify({
			RH_ID,
			inuse: 1,
			Fahrer_ID: fahrerId,
			history: `${datum} ${time}, Tour übernommen`
		})
	)

	try {
		const response = await fetch(settings.fahrer.header.url, {
			method: 'POST',
			headers: fetchHeaderPost,
			body: formData.toString()
		})

		const { info, error } = await response.json()

		if (info) {
			rhId.set(RH_ID)
			console.log(`Tour ${RH_ID} wurde übernommen`, info)
		}

		if (error) {
			alert(JSON.stringify(error))
			throw new Error(error)
		}
	} catch (f) {
		console.error('Fehler selectRoute:', f)
		// throw new Error(f)
	}
}

export const getSearchGet = async (url: string) => {
	try {
		const response = await fetch(url, fetchHeaderGet)
		if (!response.ok) {
			throw new Error(`HTTP-Fehler! Status: ${response.status}`)
		}
		const { data, error } = await response.json()

		if (data) {
			console.log(`Suche wurden geladen: ${data.length} rows`)

			return data
		}

		if (error) {
			console.log('Error Header-Data', error)
			throw new Error(error)
		}
	} catch (error) {
		console.error('Fehler beim Abrufen der Daten:', error)
	}
}
