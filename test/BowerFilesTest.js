/**
 * Created by patrikx3 on 12/17/16.
 */

const should = require('should');

describe('bower.json', () => {
    it('it includes at least a js and a css file', (done) => {

        const fs = require('fs');

        fs.readFile('bower.json', function(err, data){
            if (err) {
                done(err);
            }
            const bower = JSON.parse(data);

            should.exist(bower.main, 'Bower main exist.');
            should.ok(bower.main.length > 2, 'Bower includes at least 2 files');
            const cssFileExists = bower.main.filter((data) => {
                return data.toLowerCase().endsWith('.css');
            });
            cssFileExists.length.should.be.equal(1);

            const jsFileExists = bower.main.filter((data) => {
                return data.toLowerCase().endsWith('.js');
            });
            jsFileExists.length.should.be.equal(1);

            done();
        });

    });
})
