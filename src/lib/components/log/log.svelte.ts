import alerts from './alerts.json'
import uuid from '../../utils/uuid'
interface Note {
	id: string
	type: string
	message: string
	dismiss: boolean
	timeout: number
}
export class MsgLogger {
	buffer: Note[] = $state([])
	list: Note[] = $state([])
	currentIndex: number = $state(0)
	timeId: number = $state(0)
	#busy: boolean = $state(false)

	get busy() {
		return this.#busy
	}

	set busy(value) {
		this.#busy = value
	}

	add(message: Note) {
		const id = uuid()
		const defaults = {
			id,
			type: 'info',
			dismissible: true,
			timeout: 5000
		}
		const mObj = { ...defaults, ...message }
		this.buffer.push(mObj)

		if (this.buffer.length === 1) {
			this.showNextMessage()
		}
	}
	dismissMessage(id: string) {
		this.list = this.list.filter((t) => t.id !== id)
	}

	async showNextMessage() {
		if (this.#busy) return
		if (!this.buffer.length) {
			clearTimeout(this.timeId)
			this.#busy = false

			return
		}

		this.#busy = true
		const speed = 4
		const msg = this.buffer.shift()
		const text = msg?.message
		const duration = text.length / (speed * 0.01)
		this.list.push(msg)
		this.timeId = setTimeout(() => {
			if (msg.timeout)
				setTimeout(() => this.dismissMessage(msg.id), msg.timeout)
			this.#busy = false
			this.showNextMessage()
		}, duration)
	}

	remove(id: string) {
		this.list = this.list.filter((t) => t.id !== id)
	}

	empty() {
		if (this.#busy) return
		// this.scrollDown()
		if (!this.list.length) {
			clearTimeout(this.timeId)
			this.#busy = false

			return
		}

		this.#busy = true
		this.list.shift()
		this.timeId = setTimeout(() => {
			this.#busy = false
			this.empty()
		}, 400)
	}

	clear() {
		clearTimeout(this.timeId)
		this.buffer = []
		this.list = []
		this.#busy = false
	}
}

export const log = new MsgLogger()

export function getNote(): Note {
	const i = Math.floor(Math.random() * alerts.length)
	const obj = alerts[i]
	const { type, message, dismissible, timeout } = obj
	return { type, message, dismissible, timeout }
}

export default log
