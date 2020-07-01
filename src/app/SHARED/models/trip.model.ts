export interface Trip{
    origin:{
        name: string
    },
    destination:{
        name: string
    },
    coords?:{
        lat: number,
        lgn:number
    }
    tripDuration?: {value: number, text: string},
    distance?: {value:number, text: string }
    tripDurationSec?: number,
    notification?: number,
    active?:boolean,
    fence?:number,
    fenceTime?: number
}