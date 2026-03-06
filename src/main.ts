import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { init, location } from '@svelte-router/core'
init({ defaultHash: true })
location.navigate('/')
const app = mount(App, {
	target: document.getElementById('app')!
})

export default app
