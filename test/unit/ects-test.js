var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var ects;

var ectsNoData = [
];

var ectsSingleData = [
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Machine-Learning',
        ects: 6
    }
];

var ectsMultipleDataWithEmptyDate = [
    {
        date: null,
        ects: 5,
        name: 'Machine-Learning'
    },
    {
        date: null,
        ects: 4,
        name: 'Machine-Learning'
    },
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        ects: 6,
        name: 'Machine-Learning'
    },
    {
        date: 'Do 11:45-13:15 \nDi 14:15-15:45',
        ects: 7,
        name: 'Machine-Learning 2'
    }
];

describe ('ects', function() {
    'use strict';

    beforeEach(function() {
        ects = rewire('../../lib/ects');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureDate', function() {
        expect(ects).to.be.a('function');
    });

    it('should call client', function(done) {
        var searchDetailsSpy = sandbox.spy();
        ects.__set__('client', {searchDetails: searchDetailsSpy});
        expect(searchDetailsSpy.calledWithExactly(
            'Machine-Learning', done()));
    });

    it('should return answer if no lecture was found', function(done) {
        var expected = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';
        testResponse('invalid lecture', expected, ectsNoData, done);
    });

    it('should return answer for single lecture', function(done) {
        var expected = 'Machine-Learning hat 6 ECTS';
        testResponse('Machine-Learning', expected, ectsSingleData, done);
    });

    it('should return answer for multiple lecture ' +
        'with empty date entries', function(done) {
        var expected = 'Ich habe 2 Vorlesungen gefunden: ' +
            'Machine-Learning hat 6 ECTS, Machine-Learning 2' +
            ' hat 7 ECTS';
        testResponse('Machine-Learning', expected,
            ectsMultipleDataWithEmptyDate, done);
    });

    it('should provide error if client throws one', function(done) {
        sandbox.stub(ects.__get__('client'), 'searchDetails')
            .callsArgWith(2, new Error('Test Message'), null);
        ects('Machine-Learning', function(err) {
            expect(err.message).to.equal('Test Message');
            done();
        });
    });
});

function testResponse(lecture, expected, dataMock, done) {
    'use strict';

    sandbox.stub(ects.__get__('client'), 'searchDetails')
        .callsArgWith(2, null, dataMock);

    ects(lecture, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
}