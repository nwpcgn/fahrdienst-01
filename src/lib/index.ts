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
