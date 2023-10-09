import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { elevators } from '../shared/config';
import { ELEVATOR_EVENTS } from '../shared/enum/events';

export class ElevatorFunctions {
    static init() {
        elevators.forEach((elevator) => {
            elevator.elevatorStops.forEach((stop) => {
                let _isPlayerOnly, _scale, _range
                if (elevator.isCarElevator) {
                    _isPlayerOnly = false;
                    _scale = new alt.Vector3(3, 3, 0)
                    _range = 3
                } else {
                    _isPlayerOnly = true
                    _scale = new alt.Vector3(1, 1, 0)
                    _range = 1
                }
                Athena.controllers.interaction.append({
                    position: { x: stop.pos.x, y: stop.pos.y, z: stop.pos.z - 1 },
                    isPlayerOnly: _isPlayerOnly,
                    range: _range,
                    async callback(player) {
                        // Check for each Stop if it has an KeyItem or Permission set
                        for (let _stop of elevator.elevatorStops) {

                            // Check if keyitem or permission is set for this stop and show the stop if player has item or permission
                            if (typeof _stop.keyItemName !== 'undefined' || typeof _stop.permission !== 'undefined') {
                                _stop.show = false
                                if (typeof _stop.keyItemName !== 'undefined') {
                                    if (await Athena.player.inventory.has(player, _stop.keyItemName, 1)) {
                                        _stop.show = true
                                    }
                                }
                                if (typeof _stop.permission !== 'undefined') {
                                    if (Athena.player.permission.hasPermission(player, _stop.permission) || Athena.player.permission.hasAccountPermission(player, _stop.permission)) {
                                        _stop.show = true
                                    }
                                }
                            } else {
                                _stop.show = true
                            }

                            // Dont show stop if it is the starting Point
                            if (_stop.name === stop.name) {
                                _stop.show = false
                            }

                            // If Account/Character has permission "debug" it will show all stops no matter what
                            if (Athena.player.permission.hasAccountPermission(player, 'debug') || Athena.player.permission.hasPermission(player, 'debug')) {
                                _stop.show = true
                            }

                        }
                        alt.emitClient(player, ELEVATOR_EVENTS.VIEW_OPEN, elevator);
                    },
                })

                // Checks if the showmarker atribute is set and if not sets it to show the marker otherwise uses whatever is set in config of Elevator
                let showmarker = typeof stop.showmarker !== "undefined" ? stop.showmarker : (stop.showmarker = true)
                if (showmarker) {
                    Athena.controllers.marker.append({
                        color: new alt.RGBA(0, 113, 255),
                        pos: { x: stop.pos.x, y: stop.pos.y, z: stop.pos.z - 0.98 },
                        type: 25,
                        scale: _scale
                    })
                }
            })
        })
    }

    static teleport(player: alt.Player, targetCords: alt.IVector3, vehicle: alt.Vehicle, targetRot: alt.Vector3 = new alt.Vector3(0, 0, 0)) {
        Athena.player.emit.fadeScreenToBlack(player, 1000);
        alt.setTimeout(() => {
            Athena.player.safe.setPosition(player, targetCords.x, targetCords.y, targetCords.z);
            if (typeof vehicle !== 'undefined') {
                vehicle.rot = targetRot
            } else {
                player.rot = targetRot
            }
            alt.setTimeout(() => {
                Athena.player.emit.fadeScreenFromBlack(player, 500);
            }, 100)
        }, 1100)
    }
}

alt.onClient(ELEVATOR_EVENTS.TELEPORT, ElevatorFunctions.teleport);
