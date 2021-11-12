/**
 * The error class of comet
 */

class CometError extends TypeError {

    /**
     * @param {string} message The message of the error
     */

    constructor(message) {

        super();
        this.name = 'Comet ERROR';
        this.message = message;

    }

}

module.exports = CometError;