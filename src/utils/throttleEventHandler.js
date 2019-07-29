import { throttle } from 'lodash';

export const throttleEventHandler = (...args) => {
    const throttled = throttle(...args)
    return function (e) {
        e.persist()
        return throttled(e)
    }
}