Que's IoT Controller
===

### What is this?
This app is an fancy [IoT](http://en.wikipedia.org/wiki/Internet_of_Things) controller.
However, what makes this app different is it's easy to host yourself, and it is a relatively easy
to develop your own things. Every other platform that I've seen has a dashboard of some sort that
you can configure stuff, and most likely get nearly what you want. It works reasonably well, but
I, like many people, want to be able to control every aspect of each thing. That is the niche this
app plans to fill.

### Ok, that sounds cool. How do I make this "thing" you speak of?
Well, it's pretty simple if you're familiar in Javascript and Node. A simple thing is available in another
repository that I have:

[Examples are here](https://github.com/1egoman/que-iot-examples)


To run it:
  - Terminal window 1: `node index.js` (inside the root of this repository)
  - Terminal window 2: `node index.js` (inside the client thing you just made)
  - Now go to '127.0.0.1:8000' in your web browser

<!-- *NOTE: If you want to see what is happening in a nice, fancy web ui, I'd also recommend in a 3rd window
(I know, starting to get a little crazy with the terminal windows) running
`cd public; python -m SimpleHTTPServer 8001` and go to 127.0.0.1:8001 in a web browser before running any
of the above commands* -->

### License

The MIT License (MIT)
Copyright (c) 2014 Ryan Gaus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
