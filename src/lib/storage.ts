import type { LocalStore } from './types'
import useLocalStorage from './useLocalStorage'

export let apiStore: LocalStore = useLocalStorage('apiStore', {
	key: null,
	datum: null,
	step: 1
})
