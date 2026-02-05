import type { LocalStore } from './types'
import useLocalStorage from './useLocalStorage'

export const apiStore: LocalStore = useLocalStorage('apiStore', {
	key: '',
	datum: '',
	url1: '',
	name: '',
	fahrer: '',
	boxen: 0,
	tourId: 0,
	step: 1
})

export const uid: string = useLocalStorage('uid', '')
export const rhId: number = useLocalStorage('rhId', 0)
export const tourId: number = useLocalStorage('tourId', 0)
