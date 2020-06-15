export interface Trip{
    origin:{
        name: string
    },
    destination:{
        name: string
    },
    tripDuration?: number,
    tripDurationSec?: number,
    notification?: number,
    active?:boolean
}