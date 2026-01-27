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
