var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var lectureDate;

var lectureDateSingleData = [
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Machine-Learning'
    }
];

var lectureDateMultipleDataWithEmptyDate = [
    {
        date: null,
        name: 'Machine-Learning'
    },
    {
        date: null,
        name: 'Machine-Learning'
    },
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Machine-Learning'
    },
    {
        date: 'Do 11:45-13:15 \nDi 14:15-15:45',
        name: 'Machine-Learning 2'
    }
];

describe ('lectureDate', function() {
    'use strict';

    beforeEach(function() {
        lectureDate = rewire('../../lib/lectureDate');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureDate', function() {
        expect(lectureDate).to.be.a('function');
    });

    it('should call client', function(done) {
        var searchDetailsSpy = sandbox.spy();
        lectureDate.__set__('client', {searchDetails: searchDetailsSpy});
        expect(searchDetailsSpy.calledWithExactly(
            'Ultra Large Scale System', done()));
    });

    it('should return answer for single lecture', function(done) {
        var expected = 'Machine-Learning findet am Mittwoch von 11:45-13:15 ' +
            'und Mittwoch von 14:15-15:45 statt';
        testResponse('Machine-Learning', expected, lectureDateSingleData, done);
    });

    it('should return answer for multiple lecture ' +
        'with empty date entries', function(done) {
        var expected = 'Ich habe 2 Vorlesungen gefunden: ' +
            'Machine-Learning findet am Mittwoch von 11:45-13:15' +
            ' und Mittwoch von 14:15-15:45 statt, Machine-Learning 2' +
            ' findet am Donnerstag von 11:45-13:15 und Dienstag' +
            ' von 14:15-15:45 statt';
        testResponse('Machine-Learning', expected,
            lectureDateMultipleDataWithEmptyDate, done);
    });
});

function testResponse(lecture, expected, dataMock, done) {
    'use strict';

    sandbox.stub(lectureDate.__get__('client'), 'searchDetails')
        .callsArgWith(2, null, dataMock);

    lectureDate(lecture, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
}