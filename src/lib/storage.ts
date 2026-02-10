import type { LocalStore } from './types'
import useLocalStorage from './useLocalStorage'

export const routeStore: LocalStore = useLocalStorage('routeStore', {
	Routentyp: 1,
	Routenname: 'AA',
	Fahrer: '',
	Boxen: 0,
	RH_ID: 0,
	Zusatzinfo: ''
})
export const routeLength: number = useLocalStorage('routeLength', 0)
export const uid: string = useLocalStorage('uid', '')
export const rhId: number = useLocalStorage('rhId', 0)
export const tourId: number[] = useLocalStorage('tourId', [])
export const fid: number = useLocalStorage('fid', 0)
export const fahrer: string = useLocalStorage('fahrer', '')
export const alertList: string[] = useLocalStorage('alertList', [])
