// Model object to represent a session, which includes dateTime,recorder,handler,site: 'GWA1',array, noCaptures,trapStatus: 'OPEN',commentsAboutTheArray,year,
export default class Session {
    // Check fields that are passed in to make sure it is valid. Members should be private
    constructor({
        dateTime,
        recorder,
        handler,
        site,
        array,
        noCaptures,
        trapStatus,
        commentsAboutTheArray,
        year,
    }) {
        this.dateTime = dateTime;
        this.recorder = recorder;
        this.handler = handler;
        this.site = site;
        this.array = array;
        this.noCaptures = noCaptures;
        this.trapStatus = trapStatus;
        this.commentsAboutTheArray = commentsAboutTheArray;
        this.year = year;
    }

    // Getters and setters
    getDateTime() {
        return this.dateTime;
    }

    setDateTime(dateTime) {
        this.dateTime = dateTime;
    }

    getRecorder() {
        return this.recorder;
    }

    setRecorder(recorder) {
        this.recorder = recorder;
    }

    getHandler() {
        return this.handler;
    }

    setHandler(handler) {
        this.handler = handler;
    }

    getSite() {
        return this.site;
    }

    setSite(site) {
        this.site = site;
    }

    getArray() {
        return this.array;
    }

    setArray(array) {
        this.array = array;
    }

    getNoCaptures() {
        return this.noCaptures;
    }

    setNoCaptures(noCaptures) {
        this.noCaptures = noCaptures;
    }

    getTrapStatus() {
        return this.trapStatus;
    }

    setTrapStatus(trapStatus) {
        this.trapStatus = trapStatus;
    }

    getCommentsAboutTheArray() {
        return this.commentsAboutTheArray;
    }

    setCommentsAboutTheArray(commentsAboutTheArray) {
        this.commentsAboutTheArray = commentsAboutTheArray;
    }

    getYear() {
        return this.year;
    }

    setYear(year) {
        this.year = year;
    }

    // Methods

    // Returns a string representation of the object
    toString() {
        return `dateTime: ${this.dateTime}
            recorder: ${this.recorder}
            handler: ${this.handler}
            site: ${this.site}
            array: ${this.array}
            noCaptures: ${this.noCaptures}
            trapStatus: ${this.trapStatus}
            commentsAboutTheArray: ${this.commentsAboutTheArray}
            year: ${this.year}`;
    }

    // Returns a JSON representation of the object
    toJSON() {
        return {
            dateTime: this.dateTime,
            recorder: this.recorder,
            handler: this.handler,
            site: this.site,
            array: this.array,
            noCaptures: this.noCaptures,
            trapStatus: this.trapStatus,
            commentsAboutTheArray: this.commentsAboutTheArray,
            year: this.year,
        };
    }
}
