module.exports = {

    /**
     * A function to merge object defaults
     * @param {object} d 
     * @param {object} n 
     * @returns {object}
     */

    fromDefault(d, n) {

        let final = n;

        for(var k of Object.keys(d)) {
            if(!n[k]) final[k] = d[k]
        }

        return final

    }

}