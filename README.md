# Comet API <img src="https://c0met.xyz/assets/img/icon.png" alt="Comet" width="25px" />

Comet is an API focused on facilitating the work of developers by providing them with various image modifiers and other tools so that they can provide a better service

Made by:

* [Esponjosin](https://esponjosin.xyz)
* [BulzyKrown](https://bulzyland.xyz)

<b>Join our [Discord Server](https://discord.gg/aFaFUY9755) for Support

For more help view [Documentation](https://docs.com3t.xyz)</b>

To get the token go to [Panel](https://com3t.xyz/panel)</b>

## Features

* Cache on server
* Optimized code
* Great Support
* Flexible

# Methods

* [Token](#token)
* [Amiajoke](#amiajoke)
* [Beautiful](#beautiful)
* [Beautiful2](#beautiful2)
* [Blur](#blur)
* [Border](#border)
* [Concierge](#concierge)
* [Convolutional](#convolutional)
* [Darling](#darling)
* [Ed](#ed)
* [Flip](#flip)
* [Glitch](#glitch)
* [Grayscale](#grayscale)
* [Invert](#invert)
* [Invert_grayscale](#invert_grayscale)
* [Not_Stonk](#not_stonk)
* [Pencil_shading](#pencil_shading)
* [Peridot](#peridot)
* [Pixel](#pixel)
* [Rip](#rip)
* [Sepia](#sepia)
* [Stonk](#stonk)
* [Spin](#spin)
* [Tint](#tint)
* [Triggered](#triggered)
* [Delet](#delet)
* [Color](#color)
* [Lyrics](#lyrics)
* [McServer](#mcserver)
* [PreColor](#precolor)
* [Screenshot](#screenshot)
* [YT](#yt)
* [AI](#ai)
* [Base64](#base64)
* [Binary](#binary)
* [SW](#swearword)
* [Zalgo](#zalgo)



# Token

```js

/**
 * @return {Promise<String>}
 */

Comet.Token()

```

# Amiajoke

```js

/**
 * @return {Promise<Buffer>}
 */


Comet.Amiajoke(avatar)

```

# Beautiful

```js

/**
 * @return {Promise<Buffer>}
 */


Comet.Beautiful(avatar)

```

# Beautiful2

```js

/**
 * @return {Promise<Buffer>}
 */


Comet.Beautiful2(avatar)

```

# Challenger

```js

/**
 * @return {Promise<Buffer>}
 */


Comet.Challenger(avatar)

```

# Blur

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Blur(avatar, count)

//Count is optional

```

# Border

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Border(avatar, border, line)

//Line is optional

```

# Concierge

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Concierge(avatar, avatar1)

```

# Convolutional

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Convolutional(avatar, ConFilter)

//Convolutional filter help: https://docs.gimp.org/2.8/en/plug-in-convmatrix.html

```

# Darling

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Darling(avatar)

```

# Ed

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Ed(avatar, avatar1)

```

# Flip

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Flip(avatar)

```

# Glitch

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Glitch(avatar)

```

# Grayscale

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Grayscale(avatar)

```

# Invert

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Invert()

```

# Invert_grayscale

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Invert_Grayscale(avatar)

```

# Not_Stonk

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Not_Stonk(avatar)

```

# Pencil_Shading

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Pencil_Shading(avatar)

```

# Peridot

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Peridot(avatar)

```

# Pixel

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Pixel(avatar)

```

## Rip

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Rip(avatar, name)
//Name is optional

```

# Sepia

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Sepia(avatar)

```

# Stonk

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Stonk(avatar)

```

# Spin

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Spin(avatar)

```

# Tint

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Tint(avatar, color)

```

# Triggered

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Triggered(avatar)

```

# Delet

```js

/**
 * @return {Promise<Buffer>}
 */

Comet.Delet(avatar)

```

# Color

```js

/**
 * @return {Promise<Object>}
 */

Comet.Color(hex)

```

# Lyrics

```js

/**
 * @return {Promise<Object>}
 */

Comet.Lyrics(song_name)

```

# McServer

```js

/**
 * @return {Promise<Object>}
 */

Comet.McServer(server_ip)

```

# PreColor

```js

/**
 * @return {Promise<Object>}
 */

Comet.PreColor(avatar)

```

# Screenshot

```js

/**
 * @return {Promise<Object>}
 */

Comet.Screenshot(url)

```

# YT

```js

/**
 * @return {Promise<Object>}
 */

Comet.YT(video_id)

```

# AI

```js

/**
 * @return {Promise<Object>}
 */

Comet.AI(message)

```

# Base64

```js

/**
 * @return {Promise<Object>}
 */

Comet.Base64(text, convert/decode)

```

# Binary

```js

/**
 * @return {Promise<Object>}
 */

Comet.Binary(text, convert/decode)

```

# Swearword

```js

/**
 * @return {Promise<Object>}
 */

Comet.SW(text)

```

# Zalgo

```js

/**
 * @return {Promise<Object>}
 */

Comet.Zalgo(text)

```


## Example

```js
global.Comet = new (require('c0met'))('TOKEN')
let prefix = "!";

<Client>.on('message', (message) => {

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    if(command == 'beautiful') {

        let avatar = (message.mentions.users.first() || message.author).displayAvatarURL({ format: 'png', size: 512 });

        let img = await Comet.Beautiful(avatar).catch(e => false);

        if(!img) return message.channel.send(':x: | An error occurred');

        message.channel.send({ files: [
            {
                attachment: img,
                name: 'beautiful.png'
            }
        ] })

    }

})

```
