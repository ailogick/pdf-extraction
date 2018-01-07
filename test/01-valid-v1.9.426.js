const assert = require('assert');
const PDF = require('../');
const fs = require('fs');

// to test another valid pdf file just change this 5 constants.
const PDF_FILE = './test/data/01-valid.pdf';
const VERSION = 'v1.9.426';
const PDF_PAGE_COUNT = 14;
const FIST_PAGE_TEXT = 'Optimizations Because traces are in SSA form and have no join points';
const LAST_PAGE_TEXT = 'not be interpreted as necessarily representing the official views';

//TODO: add extra test cases.
describe(`File:${PDF_FILE} PDF.js Version:${VERSION}`, function() {
    let dataBuffer = fs.readFileSync(PDF_FILE);
    it('should pass parse', function() {
        let options = {
            version: VERSION
        };

        return PDF(dataBuffer, options).then(function(data) {
            //fs.writeFileSync(`${PDF_FILE}.txt`, data.text, 'utf8');
            assert.equal(data.numpages, PDF_PAGE_COUNT);
            assert.equal(data.numrender, PDF_PAGE_COUNT);
            assert.equal(data.text.includes(FIST_PAGE_TEXT), true);
            assert.equal(data.text.includes(LAST_PAGE_TEXT), true);
            assert.notEqual(data.info, null);
        });
    });

    it('should pass parse with option pagerender:null', function() {
        let options = {
            version: VERSION,
            pagerender: null,
            max: 0
        };

        return PDF(dataBuffer, options).then(function(data) {
            //fs.writeFileSync('./data/01-test.txt', data.text, 'utf8');
            assert.equal(data.numpages, PDF_PAGE_COUNT);
            assert.equal(data.numrender, PDF_PAGE_COUNT);
            assert.equal(data.text.includes(FIST_PAGE_TEXT), true);
            assert.equal(data.text.includes(LAST_PAGE_TEXT), true);
            assert.notEqual(data.info, null);
        });
    });


    it('should pass parse with option pagerender:undefined', function() {
        let options = {
            version: VERSION,
            max: 0
        };

        return PDF(dataBuffer, options).then(function(data) {
            //fs.writeFileSync('./data/01-test.txt', data.text, 'utf8');
            assert.equal(data.numpages, PDF_PAGE_COUNT);
            assert.equal(data.numrender, PDF_PAGE_COUNT);
            assert.equal(data.text.includes(FIST_PAGE_TEXT), true);
            assert.equal(data.text.includes(LAST_PAGE_TEXT), true);
            assert.notEqual(data.info, null);
        });
    });


    it('should pass parse with option max:-1', function() {
        let options = {
            version: VERSION,
            max: -1
        };

        return PDF(dataBuffer, options).then(function(data) {
            //fs.writeFileSync('./data/01-test.txt', data.text, 'utf8');
            assert.equal(data.numpages, PDF_PAGE_COUNT);
            assert.equal(data.numrender, PDF_PAGE_COUNT);
            assert.equal(data.text.includes(FIST_PAGE_TEXT), true);
            assert.equal(data.text.includes(LAST_PAGE_TEXT), true);
            assert.notEqual(data.info, null);
        });
    });


    it(`should pass parse with option max:${PDF_PAGE_COUNT-1}`, function() {
        let options_01 = {
            version: VERSION,
            max: PDF_PAGE_COUNT - 1
        };

        let options_02 = {
            version: VERSION
        };

        return PDF(dataBuffer, options_01).then(function(data) {

            //fs.writeFileSync('./data/01-test.txt', data.text, 'utf8');
            assert.equal(data.numpages, PDF_PAGE_COUNT);
            assert.equal(data.numrender, PDF_PAGE_COUNT - 1);
            assert.equal(data.text.includes(FIST_PAGE_TEXT), true);
            assert.notEqual(data.text.includes(LAST_PAGE_TEXT), true);
            assert.notEqual(data.info, null);
        }).then(function() {
            return PDF(dataBuffer, options_02).then(function(data) {
                //fs.writeFileSync('./data/01-test.txt', data.text, 'utf8');
                assert.equal(data.numpages, PDF_PAGE_COUNT);
                assert.equal(data.numrender, PDF_PAGE_COUNT);
                assert.equal(data.text.includes(FIST_PAGE_TEXT), true);
                assert.equal(data.text.includes(LAST_PAGE_TEXT), true);
                assert.notEqual(data.info, null);
            });
        });
    });


    it(`should pass parse with option max:${PDF_PAGE_COUNT-1} & render callback`, function() {
        function render_page(pageData, ret) {
            //check documents https://mozilla.github.io/pdf.js/
            ret.text = ret.text ? ret.text : "";

            let render_options = {
                //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
                normalizeWhitespace: true,
                //do not attempt to combine same line TextItem's. The default value is `false`.
                disableCombineTextItems: false
            }

            return pageData.getTextContent(render_options)
                .then(function(textContent) {
                    let strings = textContent.items.map(item => item.str);
                    let text = strings.join(' ');
                    ret.text = `${ret.text} ${text} \n\n`;
                });
        }

        let options_01 = {
            version: VERSION,
            max: PDF_PAGE_COUNT - 1,
            pagerender: render_page
        };

        let options_02 = {
            version: VERSION
        };

        return PDF(dataBuffer, options_01).then(function(data) {

            //fs.writeFileSync('./data/01-test.txt', data.text, 'utf8');
            assert.equal(data.numpages, PDF_PAGE_COUNT);
            assert.equal(data.numrender, PDF_PAGE_COUNT - 1);
            assert.equal(data.text.includes(FIST_PAGE_TEXT), true);
            assert.notEqual(data.text.includes(LAST_PAGE_TEXT), true);
            assert.notEqual(data.info, null);
        }).then(function() {
            return PDF(dataBuffer, options_02).then(function(data) {
                //fs.writeFileSync('./data/01-test.txt', data.text, 'utf8');
                assert.equal(data.numpages, PDF_PAGE_COUNT);
                assert.equal(data.numrender, PDF_PAGE_COUNT);
                assert.equal(data.text.includes(FIST_PAGE_TEXT), true);
                assert.equal(data.text.includes(LAST_PAGE_TEXT), true);
                assert.notEqual(data.info, null);
            });
        });
    });


    it(`should pass parse with option max:${PDF_PAGE_COUNT-1} & render modified callback`, function() {
        function render_page(pageData, ret) {
            //check documents https://mozilla.github.io/pdf.js/
            ret.text = ret.text ? ret.text : "";

            let render_options = {
                //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
                normalizeWhitespace: true,
                //do not attempt to combine same line TextItem's. The default value is `false`.
                disableCombineTextItems: false
            }

            return pageData.getTextContent(render_options)
                .then(function(textContent) {
                    //let strings = textContent.items.map(item => item.str);
                    //let text = strings.join(' ');
                    //ret.text = `${ret.text} ${text} \n\n`;
                    ret.text = 'modified callback';
                });
        }

        let options_01 = {
            version: VERSION,
            max: PDF_PAGE_COUNT - 1,
            pagerender: render_page
        };

        let options_02 = {
            version: VERSION
        };

        return PDF(dataBuffer, options_01).then(function(data) {

            //fs.writeFileSync('./data/01-test.txt', data.text, 'utf8');
            assert.equal(data.numpages, PDF_PAGE_COUNT);
            assert.equal(data.numrender, PDF_PAGE_COUNT - 1);
            assert.equal(data.text.includes('modified callback'), true);
            assert.notEqual(data.text.includes(LAST_PAGE_TEXT), true);
            assert.notEqual(data.info, null);
        }).then(function() {
            return PDF(dataBuffer, options_02).then(function(data) {
                //fs.writeFileSync('./data/01-test.txt', data.text, 'utf8');
                assert.equal(data.numpages, PDF_PAGE_COUNT);
                assert.equal(data.numrender, PDF_PAGE_COUNT);
                assert.equal(data.text.includes(FIST_PAGE_TEXT), true);
                assert.equal(data.text.includes(LAST_PAGE_TEXT), true);
                assert.notEqual(data.info, null);
            });
        });
    });


});
