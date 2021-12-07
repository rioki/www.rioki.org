// YouTube GDPR Compliant Embed Code
// Copyright 2021 Sean Farrell <sean.farrell@rioki.org>
// 
// ermission is hereby granted, free of charge, to any person obtaining a copy of 
// this software and associated documentation files (the "Software"), to deal in 
// the Software without restriction, including without limitation the rights to 
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
// of the Software, and to permit persons to whom the Software is furnished to do 
// so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
// THE SOFTWARE.

function ytLoadEmbedCode(e, video) {
  const elem = e.parentElement
  elem.innerHTML =
    `<iframe src="https://www.youtube-nocookie.com/embed/${video}?autoplay=1" title="YouTube video player"` +
      'frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
}

function ytConsent(options) {

  const imagePrefix = (options && options.imagePrefix) ? options.imagePrefix : 'https://i.ytimg.com/vi_webp'
  const consentText = (options && options.consentText) ? options.consentText : 'By clicking the play button you consent to <a href="https://policies.google.com/privacy?hl=en">Gogle\'s Privacy Policy.</a>'

  function handleLinks() {
    const elems = document.getElementsByClassName('yt-link')
    for (let i = 0; i < elems.length; i++) {
      const video     = elems[i].getAttribute('data-video');
      const thumbnail = elems[i].hasAttribute('data-thumbnail') ? elems[i].getAttribute('data-thumbnail') : `${imagePrefix}/${video}/sddefault.webp`;
      if (video) {
        elems[i].innerHTML =
          `<a href="https://www.youtube.com/watch?v=${video}" target="_blank">` +
          `<img src="${thumbnail}" />` + 
          '<button class="yt-play">▶</button>' +
          '<p class="yt-watch">Watch on <b>YouTube</b></p>' +
          '</a>'
      }
    }
  }

  function handleEmbed() {
    const elems = document.getElementsByClassName('yt-embed')
    for (let i = 0; i < elems.length; i++) {
      const elem      = elems[i];
      const video     = elems[i].getAttribute('data-video');
      const thumbnail = elems[i].hasAttribute('data-thumbnail') ? elems[i].getAttribute('data-thumbnail') : `${imagePrefix}/${video}/sddefault.webp`;
      if (video) {
        elem.innerHTML =
          `<img src="${thumbnail}" />` + 
          `<p class="yt-legal">${consentText}</p>` +
          `<button class="yt-play" onclick="ytLoadEmbedCode(this, \'${video}\')">▶</button>` +
          `<a href="https://www.youtube.com/watch?v=${video}" target="_blank"><p class="yt-watch">Watch on <b>YouTube</b></p></a>`
      }
    }
  }

  handleLinks()
  handleEmbed()
}