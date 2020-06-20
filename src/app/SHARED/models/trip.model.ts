export interface Trip{
    origin:{
        name: string
    },
    destination:{
        name: string
    },
    tripDuration?: {value: number, text: string},
    distance?: {value:number, text: string }
    tripDurationSec?: number,
    notification?: number,
    active?:boolean,
    fence?:number
}