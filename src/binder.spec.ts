import { sync, async } from './binder';
import 'mocha';
import { expect } from 'chai';

const id = `async (dynamic input) => { return input; }`;

describe('sync()', () => {
    it('support binding to CLR that\'s compiled on the fly', () => {
        const identity = sync<number, number>(id);

        const input = Math.random();
        const result = identity(input);

        expect(result).to.equal(input);
    });

    // TODO implement tests for pre-compiled sync bindings
});

describe('async()', () => {
    it('support binding to CLR that\'s compiled on the fly', (done) => {
        const identity = async<number, number>(id);

        const input = Math.random();

        identity(input)
            .then((result: any) => {
                if (result === input) {
                    done();
                } else {
                    done('Unexpected result returned');
                }
            })
            .catch(done);
    });

    // TODO implement test for precompiled async bindings
});
