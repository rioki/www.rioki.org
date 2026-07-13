# No, your AI is not hallucinating, it can't even...

I recently [published a book](https://light-sword-manual.com/book.html) and I tried to use [gulp.js](https://gulpjs.com/) to generate an ebook from Markdown files. As any software developer who does not have a clue what to do, I pulled out my trusty AI and asked it to think on my behalf.

The result was the oddest gulpfile I have ever seen. Gulp is built on the idea that you use and build small transformers, then chain them together into different content pipelines that do the actual "compilation". But OpenCode, powered by ChatGPT 5.5, saw async functions and just dumped one big procedural function. What confused me even more was that even after refining and explaining the exact way to do it, it could only barely follow the intended pattern and kept slipping back into big procedural blocks... and in the end I just did it myself and let the stupid clanker review the code.

<!--more-->

But somehow I felt like I had seen this already... But before we go there, please bear with me, the lesson is insightful and safe for work, even if the domain is not; euphemisms will save us here...

To quote a famous [Avenue Q song: The internet is made for ...cute cat pictures](https://www.youtube.com/watch?v=LTJvdGcb7Fs). So when [Stable Diffusion](https://en.wikipedia.org/wiki/Stable_Diffusion) came along, the very first thing our single-minded denizens of the internet tried to do was generate spicy pictures with it, and it turned out that this was just impossible; at least with the original models. I don't mean that the 1001 online services that popped up would filter your prompts; I mean downloading the model and burning a hole into your RTX 4080.

The text part of the models understood the gist of the request and put two-ish people-ish on screen in somewhat the right positions, with varying degrees of undress, but the important bits were just a mess of deranged pixels.

This was not some form of clever safety training; people had not even heard about that by that time. It was purely the fact that the model simply did not have the relevant content in its training data. The best it had was swimsuit ads and beach pictures, and it showed.

People were just asking something from the model it could not do. Like me asking GPT to write Prolog-like JavaScript...

![Latent Space](/media/2026-07-08-latent_space.png)

And this is the moment we need to talk about latent space and really understand what is going on here. Latent space is an N-dimensional space that represents all potential outputs of a neural network. In the special case of an encoder/decoder network, the vector connecting the encoder and the decoder is literally a vector into the latent space. For other networks, it is more of a conceptual idea of the potential of a model.

So for illustration purposes, let's design a bad neural network with a two-dimensional latent space and three data points in the training data. This means any request that falls close to the points will get something close to the training data. If the points are sufficiently close, there is a reasonable chance that any request that falls within the triangle the points span will give a sensible result. But anything that is far away from any point and outside of the triangle will just be a hot mess.

So next time your artificial intelligence feels more like artificial stupidity, remember it's not hallucinating, it can't even. No amount of "better" prompting will get the model to perform better.

