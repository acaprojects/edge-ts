/**
 * Safe references to some of the Globals that may exist.
 */
const runtime = {
    window: typeof window !== 'undefined' ? window : {} as any,
    process: typeof process !== 'undefined' ? process : {} as any
};

/**
 * Attempt to run a function that may fail due to a ReferenceError.
 */
function attempt<T>(func: () => T, fallback: T): T {
    try {
        return func();
    }
    catch (e) {
        if (e instanceof ReferenceError) {
            return fallback;
        } else {
            throw e;
        }
    }
}

/**
 * Checks to see if the current process is executing within an electron app.
 */
export function isElectron(environment = runtime) {
    const inRenderer = () => environment.window.process === 'renderer';

    const inBackground = () => !!environment.process.versions.electron;

    return attempt(inRenderer, false) || attempt(inBackground, false);
}
