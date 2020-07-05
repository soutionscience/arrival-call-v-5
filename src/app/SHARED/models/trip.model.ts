export interface Trip{
    origin:{
        name: string
    },
    destination:{
        name: string
    },
    coords?:{
        lat: number,
        lng:number
    }
    tripDuration?: {value: number, text: string},
    distance?: {value:number, text: string }
    tripDurationSec?: number,
    notification?: number,
    active?:boolean,
    fence?:number,
    fenceTime?: number
    place_id?:string
}