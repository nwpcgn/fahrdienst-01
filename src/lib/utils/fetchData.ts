async function fetchData(url: string) {
	try {
		const res = await fetch(url)
		const data = await res.json()
		return data
	} catch (error) {
		throw new Error(error)
	}
}

export default fetchData
