const { isLineBreak } = require('typescript');

const fetch     = require('node-fetch'),
	path 		= require('path'),
    wait        = ms => new Promise((resolve, reject) => setTimeout(resolve, ms)),
    pkg         = require(path.resolve(__dirname, '../../package.json')),
    Utils       = require(path.resolve(__dirname, './Utils.js')),
    Error       = require(path.resolve(__dirname, './Error.js'));

/**
 * Client for Comet-api Wrapper
 */
class Comet {
    
    /**
     * @param {string} token Comet API Token
     */

    constructor(token) {

        if(!token) throw new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`);

        let self = this;

        self.url = "https://c0met.xyz";
		this.options = {};

        (async function() {

            const res = await self._request(`temp`, {}, {
                token: token
            }).catch(e => false);

            if(!res) {
                
                /**
                 * Property to unallow send requests
                 * @type {Boolean}
                 * @private
                 */
    
                 Object.defineProperty(self, 'dontHandle', { value: true });

                 throw new Error('The main request could not be made');

            } else {

                if(res.message) {

                    /**
                     * Property to unallow send requests
                     * @type {Boolean}
                     * @private
                     */
        
                    Object.defineProperty(self, 'dontHandle', { value: true });

                    throw new Error(res.message);
                }

                /**
                 * @private
                 */

                Object.defineProperty(self.options, 'token', { value: res.token, writable: true });

                /**
                 * @private
                 */
                
                Object.defineProperty(self.options, 'originalToken', { value: token });

                self.startAutoCheck();

                return true;

            }

        })();

    }

    /**
     * A function to periodical token check for wrapper
     * @private
     * @returns {void}
     */

    async startAutoCheck() {

		let self = this;

        try {
            
            const res = await self._request(`temp`, {}, {
                token: self.options.originalToken
            }).catch(e => false);

            if(res.message) {

                /**
                * @private
                */
        
                Object.defineProperty(self, 'dontHandle', { value: true });

                throw new Error(res.message);
            }

            if(res.token !== this.options.token) {
                
                /**
                * @private
                */

                Object.defineProperty(self.options, 'token', { value: res.token, writable: true });

            }

        } catch(e) {

        }

        await wait(60 * 1000)

        this.startAutoCheck()

    }

    /**
     * A method for Wrapper to force temp token Update
     * @private
     * @returns {any}
     */

    async forceCheck() {

		let self = this;
    
        try {
                
            const res = await self._request('/temp', {}, {
                token: self.options.originalToken
            });
    
            if(!res || typeof res != 'object' || res.message) {
    
                /**
                * @private
                */
            
                Object.defineProperty(self, 'dontHandle', { value: true });

                throw new Error(res.message);
            
            }
    
            if(res.token !== this.options.token) {
                    
                /**
                * @private
                */
    
                Object.defineProperty(self.options, 'token', { value: res.token, writable: true });
    
            }
    
        } catch(e) {
    
        }

        return;
    
    }

    /**
     * Private request function for Wrapper
     * @private
     * @param {string} path Path to make request
     * @param {object} query Query for request
     * @param {object} headers Headers for request
     * @returns {Promise<(object|string|Buffer)>} 
     */

    _request(path, query = {}, headers = {}) {

        let self = this;
        
        return new Promise(async (resolve, reject) => {

            query = Object.entries(query).map((x, i) => `${i == 0 ? '?' : '&'}${x[0]}=${encodeURIComponent(x[1])}`).join('');

            headers = Utils.fromDefault({
                'User-Agent': `Comet-Wrapper v${pkg.version}`
            }, headers)

            let res = await fetch(`${self.url}${path.startsWith('/') ? '' : '/'}${path}${query}`, {
                method: 'get',
                headers: headers
            }).catch(e => false);

            if(!res) return resolve(false)

            let body = res.headers.get('content-type').toLowerCase().startsWith('application/json') ? await res.json()
            : res.headers.get('content-type').toLowerCase().startsWith('image') ? await res.buffer()
            : res.headers.get('content-type').toLowerCase().startsWith('video') ? await res.buffer()
            : await res.text();

            return resolve(body)

        })

    }

    /**
     * Token function
     * @description Generate a token (does not apply to the API)
     * @example c.Rtñ=ky-FVhvSDbMuKÑDlcQwXkVCWbmAKKHPYwz_XOcdnGtñylqRg=ktjS
     * @reject Token error
     * @returns {Promise<string>}
     */

    Token() {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('generators/token', {}, {
                token: this.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));
            
            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Token(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res.token)

        })

    }

    /**
     * Beautiful Function
     * @description Show Uncle Stan from Gravity Falls worshiping you
     * @param {string} avatar The image that Uncle Stan will adore
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Beautiful(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/beautiful', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Beautiful(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Amiajoke Function
     * @description Generate an image with a mansage saying "I'm a joke to you?"
     * @param {string} avatar The image from the victim
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

     Amiajoke(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/amiajoke', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Beautiful(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Beautiful-2 Function
     * @description Generates a meme-like image
     * @param {string} avatar Image of the following cartoon
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

     Beautiful2(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/beautiful2', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Beautiful(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }


    /**
     * Challenger Function
     * @description Generate an image from Challenger
     * @param {string} avatar The image from the Challenger.
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

     Challenger(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/challenger', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Beautiful(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Blur Function
     * @description Generate a blur type filter on your image.
     * @param {string} avatar The image where the filter will be applied
     * @param {number} count The degree of blur the image will have
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Blur(avatar, count) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 
        
            if(!count) count = Math.floor(Math.random() * 99)+1;
    
            if(isNaN(count)) return reject(new Error(`The value of count has to be a number`));
            if(count < 1) return reject(new Error(`The value of count has to be a number greater than 0`));
            if(count >= 210) return reject(new Error(`The value of count has to be a number less than 209`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/blur', { 
                avatar: avatar,
                count: count
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Blur(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Border Function
     * @description Generate a image with a custom border.
     * @param {string} avatar The image where the border  will be applied
     * @param {string} border The border background (can be an image or a list of hexadecimal numbers)
     * @param {number} line The thickness of the border
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Border(avatar, border, line) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 
            if(!border || typeof avatar !== 'string') return reject(new Error(`You need to put an border`));
            if(!line) line = 5;
    
            if(isNaN(line)) return reject(new Error(`The value of line has to be a number`));
            if(line < 1) return reject(new Error(`The value of line has to be a number greater than 0`));
            if(line >= 20) return reject(new Error(`The value of line has to be a number less than 20`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/border', { 
                avatar: avatar,
                border: border,
                line: line
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Blur(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Concierge Function
     * @description Based on two images, generate one of the concierge type
     * @param {string} avatar1 The first avatar
     * @param {string} avatar2 The second avatar
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Concierge(avatar, avatar1) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar1`));
            if(!avatar1 || typeof avatar1 !== 'string') return reject(new Error(`You need to put an avatar2`)); 
        
            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/concierge', { 
                avatar1: avatar,
                avatar2: avatar1
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Concierge(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Convolutional Function
     * @description Apply a convolutional filter to the image (a 3x3 matrix of numbers)
     * @param {string} avatar The image where the filter will be applied
     * @param {string} filter The convolutional filter
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Convolutional(avatar, filter) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`));
            if(!filter || typeof filter !== 'string') return reject(new Error(`You need to put an filter`));
            if(!filter.includes(',')) return reject(new Error(`The filter must have 9 numerical values separated by a comma`));
            if(!filter.split(',').length > 8) return reject(new Error(`The filter must have 9 numerical values`));
        
            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/convolutional', { 
                avatar: avatar,
                filter: filter
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Convolutional(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Ed Function
     * @description Based on two images, deliver one with ED type
     * @param {string} avatar1 The first avatar
     * @param {string} avatar2 The second avatar
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Ed(avatar, avatar1) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar1`));
            if(!avatar1 || typeof avatar1 !== 'string') return reject(new Error(`You need to put an avatar2`)); 
        
            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/ed', { 
                avatar1: avatar,
                avatar2: avatar1
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Ed(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Flip Function
     * @description Returns the rotated image randomly
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Flip(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/flip', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Flip(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Glitch Function
     * @description Generates an image with a Glitch filter.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Glitch(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/glitch', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Glitch(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Grayscale Function
     * @description Generates an image with a Grayscale filter.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Grayscale(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/grayscale', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Grayscale(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Invert Grayscale Function
     * @description Generates an image with a Invert Grayscale filter.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Invert_Grayscale(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/invert_grayscale', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Invert_Grayscale(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Not Stonk Function
     * @description Generates an image with a Not Stonk.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Not_Stonk(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/nstonk', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Not_Stonk(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Invert Function
     * @description Generates an image with a Invert filter.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Invert(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/invert', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Invert(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Pencil Shading Function
     * @description Generates an image with a Pencil Shading efect.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Pencil_Shading(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/pencil_shading', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Pencil_Shading(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Peridot Function
     * @description Generate an image of peridot looking at you.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Peridot(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/peridot', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Peridot(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Pixel Function
     * @description Generates an image with a Pixel effect.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Pixel(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/pixel', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Pixel(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Rip Function
     * @description Generates an Rip image.
     * @param {string} avatar The image to be modified
     * @param {string} name The name of the person has died
     * @param {string} year The year he died
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Rip(avatar, name, year) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let q = { 
                avatar: avatar 
            }

            if(name && typeof name == 'string') q.name = name;
            if(year && typeof year == 'string') q.name = year;

            let res = await this._request('imgedit/rip', q, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Rip(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Sepia Function
     * @description Generates an image with a Sepia effect.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Sepia(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/sepia', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Sepia(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Stonk Function
     * @description Generates an image with a Stonk effect.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Stonk(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/stonk', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Stonk(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Spin Function
     * @description Generates a rotating image animation.
     * @param {string} avatar Enter the image to be animated.
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

     Spin(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/spin', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Stonk(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Tint Function
     * @description Generates an image with a Tint effect.
     * @param {string} avatar The image to be modified
     * @param {string|number} color The color of tint
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Tint(avatar, color) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 
            if(!color || !['string', 'number'].includes(typeof color)) return reject(new Error(`You need to put an color`));

            if(typeof color == 'number') color = Number(color).toString('16');
            color = color.replace('#', '');
            if(color.startsWith('0x') && color.length > 7) color = color.slice(2);

            if(!color.length > 2 && !color.length < 7) return reject(new Error(`You need to put an valid color`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/tint', { 
                avatar: avatar,
                color: '#' + color
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Tint(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Triggered Function
     * @description Generates an image with a Triggered effect.
     * @param {string} avatar The image to be modified
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

     Triggered(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/triggered', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Triggered(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Delet Function
     * @description Generates an image with Windows screen "Deleting" a image.
     * @param {string} avatar The image to be deleted.
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Delet(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('imgedit/delet', { 
                avatar: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Triggered(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * @typedef {Object} ColorInfo
     * @property {string} name The name of color
     * @property {string} hex The hexadecimal code
     * @property {string} rgb The RGB code
     * @property {string} hsl The HSL Code
     * @property {string} cymk The CYMK Code
     * @property {Array<string>} similars Similars colors,
     * @property {number} integer The integer of color,
     * @property {string} negative The negative color,
     * @property {Boolean} isLight If color is light
     * @property {Boolean} isDark If color is dark
     * @property {Buffer} example A example image of the color
     */

    /**
     * Color Function
     * @description Returns information about a Hexadecimal color.
     * @param {string|number} color The color of tint
     * @reject Token error
     * @returns {Promise<ColorInfo>}
     */

    Color(color) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!color || !['string', 'number'].includes(typeof color)) return reject(new Error(`You need to put an color`));

            if(typeof color == 'number') color = Number(color).toString('16');
            color = color.replace('#', '');
            if(color.startsWith('0x') && color.length > 7) color = color.slice(2);

            if(!color.length > 2 && !color.length < 7) return reject(new Error(`You need to put an valid color`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('information/color', { 
                color: '#' + color
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Color(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * @typedef {Object} Lyrics
     * @property {string} name Name of song
     * @property {string} author The author of song
     * @property {string} image The image of song
     * @property {string} lyric The lyric of song
     */

    /**
     * Lyric Function
     * @description Returns the information of a song.
     * @param {string} song The song from which you want to obtain information
     * @reject Token error
     * @returns {Promise<Lyrics>}
     */

    Lyric(song) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!song || typeof song != 'string') return reject(new Error(`You need to put an song`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('information/lyrics', { 
                lyric: song
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Color(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * @typedef {Object} DebugInfo
     * @property {Boolean} ping
     * @property {Boolean} query
     * @property {Boolean} querymismatch
     * @property {Boolean} ipinsrv
     * @property {Boolean} cnameinsrv
     * @property {Boolean} animatedmotd
     * @property {number} cachetime
     */

    /**
     * @typedef {Object} Motd
     * @property {Array<string>} raw
     * @property {Array<string>} clean
     * @property {Array<string>} html
     */

    /**
     * @typedef {Object} PlayersInfo
     * @property {number} online
     * @property {number} max
     */

    /**
     * @typedef {Object} McInfo
     * @property {string} ip 
     * @property {number} port
     * @property {DebugInfo} debug
     * @property {Motd} motd
     * @property {PlayersInfo} players
     * @property {string|number} version
     * @property {Boolean} online
     * @property {number} protocol
     * @property {string} hostname
     * @property {string} icon
     */

    /**
     * McServer Function
     * @description Returns the information of a minecraft server.
     * @param {string} ip The minecraft server ip from which you want to obtain information
     * @param {number} port
     * @reject Token error
     * @returns {Promise<McInfo>}
     */

    McServer(ip, port) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!ip || typeof ip != 'string') return reject(new Error(`You need to put an ip`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let q = { 
                ip: ip
            }

            if(port && typeof port == 'number') q.port = port;

            let res = await this._request('information/mcserver', q, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Color(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * @typedef {Object} PreColorInfo
     * @property {string} hex
     */

    /**
     * Pre Color Function
     * @description Obtain the predominant color of an image
     * @param {string} avatar The image to obtain color
     * @reject Token error
     * @returns {Promise<PreColorInfo>}
     */

    PreColor(avatar) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!avatar || typeof avatar !== 'string') return reject(new Error(`You need to put an avatar`)); 

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('information/precolor', { 
                image: avatar 
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.PreColor(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * Screenshot Function
     * @description Get the image of a page
     * @param {string} url The url of a web
     * @reject Token error
     * @returns {Promise<Buffer>}
     */

    Screenshot(url) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!url || typeof url != 'string') return reject(new Error(`You need to put an url`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('information/screenshot', { 
                url: url
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Screenshot(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * @typedef {Object} Duration
     * @property {number} days
     * @property {number} hours
     * @property {number} minutes
     * @property {number} seconds
     * @property {number} milliseconds
     * @property {number} microseconds
     * @property {number} nanoseconds
     */

    /**
     * @typedef {Object} VideoInfo
     * @property {string} title
     * @property {string} description
     * @property {string|number} views
     * @property {Duration} duration
     * @property {string} author
     */

    /**
     * YT Function
     * @description Get the image of a page
     * @param {string} id The id of a youtube video
     * @reject Token error
     * @returns {Promise<VideoInfo>}
     */

    YT(id) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!id || typeof id != 'string') return reject(new Error(`You need to put an video id`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('information/yt', { 
                id: id
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.YT(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }
    
    /**
     * @typedef {Object} AIResponse
     * @property {string} text
     */

    /**
     * AI Function
     * @description Talk to an artificial intelligence.
     * @param {string} message The message you want to send to artificial intelligence
     * @reject Token error
     * @returns {Promise<AIResponse>}
     */

    AI(message) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!message || typeof message != 'string') return reject(new Error(`You need to put an message`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('misc/ai', { 
                message: message
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.AI(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }
    
    /**
     * @typedef {Object} B64Response
     * @property {string} response
     */

    /**
     * Base64 Function
     * @description Convert or decode to base64.
     * @param {string} message The message you want to encode or decode in base64
     * @param {Boolean} decode Determines whether to encode or decode the
     * @reject Token error
     * @returns {Promise<B64Response>}
     */

    Base64(message, decode = false) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!message || typeof message != 'string') return reject(new Error(`You need to put an message`));
            if(typeof decode !== 'boolean') return reject(new Error(`You need to put a boolean`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('misc/base64', { 
                text: message,
                method: decode ? 'decode' : 'convert'
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Base64(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }
    
    /**
     * @typedef {Object} BinaryResponse
     * @property {string} response
     */

    /**
     * Binary Function
     * @description Convert or decode to binary.
     * @param {string} message The message you want to encode or decode in Binary
     * @param {Boolean} decode Determines whether to encode or decode the
     * @reject Token error
     * @returns {Promise<BinaryResponse>}
     */

    Binary(message, decode = false) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!message || typeof message != 'string') return reject(new Error(`You need to put an message`));
            if(typeof decode !== 'boolean') return reject(new Error(`You need to put a boolean`));
            
            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('misc/binary', { 
                text: message,
                method: decode ? 'decode' : 'convert'
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Binary(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }
    

    /**
     * @typedef {Object} SWResponse
     * @property {string} orginal
     * @property {Array<string>} found
     * @property {number} count
     * @property {number} percent
     */

    /**
     * Swear word Function
     * @description Detect swear word in text
     * @param {string} message The text you want to check
     * @reject Token error
     * @returns {Promise<SWResponse>}
     */

    SW(message) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!message || typeof message != 'string') return reject(new Error(`You need to put an message`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('moderation/sw', { 
                text: message
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Zalgo(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

    /**
     * @typedef {Object} ZalgoResponse
     * @property {string} orginal
     * @property {string} clearned
     * @property {string} converted
     */

    /**
     * Zalgo Function
     * @description Converts normal text to zalgo.
     * @param {string} message The message you want to conver into zalgo
     * @reject Token error
     * @returns {Promise<ZalgoResponse>}
     */

    Zalgo(message) {

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            if(!message || typeof message != 'string') return reject(new Error(`You need to put an message`));

            do {
                await wait(250);
            } while(!self.options.token && !self.dontHandle);

            if(!self.options || !self.options.token) return reject(new Error(`You need to enter your token, if you don't have it you can get it at https://c0met.xyz`)); 
        
            let res = await this._request('moderation/zalgo', { 
                text: message
            }, {
                token: self.options.token
            });

            if(!res) return reject(new Error('The request could not be made'));

            if(res.message && res.message == 'You need a token to use this endpoint') {
                await self.forceCheck();
                resolve(await self.Zalgo(...Object.values(arguments)));
            }

            if(res.message) return reject(new Error(res.message));

            return resolve(res)

        })

    }

}

module.exports = Comet;
