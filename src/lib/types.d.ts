export interface Tour {
	Routentyp: number
	Routenname: string
	Fahrer: string
	Boxen: number
	RH_ID: number
}

export interface TourStop {
	laufende_nummer: number
	eins_kuerzel: string
	eins_name: string
	eins_strasse: string
	eins_plz: string
	eins_ort: string
	eins_telefon: string
	eins_bedarf?: null
	eins_info: string
	eins_boxen?: string | null
	material: number
	befunde: number
	proben: number
}

export interface TourCallBack {
	eins_kuerzel: string
	befunde: number
	material: number
	proben: number
}
export interface Icons {
	slug: string
	name: string
	icon: string
}
export interface LocalStore {
	key: string
	datum: string
	tour: Tour
	step: number
}

// import type {Tour,TourStop,TourCallBack,Icons,LocalStore} from './lib/types'
