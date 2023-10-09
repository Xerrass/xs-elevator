import * as alt from 'alt-shared'
import { IElevator } from './interfaces/IElevator'

export let elevators: Array<IElevator> = new Array<IElevator>


elevators.push({
    name: "Rockford Plaza",
    isCarElevator: false,
    elevatorStops: [
        {
            name: "Hub",
            pos: new alt.Vector3(-164.8, -153.8, 93.7),
            rot: new alt.Vector3(0, 0, -1.72),
        },
        {
            name: "Ground Level",
            pos: new alt.Vector3(-237.08, -256.26, 39.117),
            showmarker: false
        }
    ]
})

elevators.push({
    name: "Rockford Plaza",
    isCarElevator: true,
    elevatorStops: [
        {
            name: "Hub",
            pos: new alt.Vector3(-166.21978759765625, -161.06373596191406, 93.6966552734375),
            rot: new alt.Vector3(0, 0, 1),
        },
        {
            name: "Ground Level",
            pos: new alt.Vector3(-166.87911987304688, -170.62417602539062, 93.6966552734375),
            showmarker: false
        }
    ]
})
