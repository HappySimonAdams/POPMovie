import {TWEEN} from "../../../src/Tween";

function tweenObj(object, coords, duration) {
    new TWEEN.Tween(object.position)
        .to({x: coords[0], y: coords[1], z: coords[2]}, duration)
        .easing(TWEEN.Easing.Linear.None)
        .start();
}

export {TWEEN, tweenObj};