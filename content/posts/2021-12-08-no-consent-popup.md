---
title: "Getting Rid of the Consent Popup."
---

How do you get rid of the consent popup? 

Simple, don't use cookies or store the users data. As simple as this sounds,
unfortunatly this is not as simple to implement.

Before we get into the details, let's look at why we needed a consent popup
in the first place. There are basically 3 pieces of legislation of interest:

  - European Union's [ePrivacy Directive][1]
  - European Union's [General Data Protection Regulation][2]
  - [California Consumer Privacy Act][3]
  
Although there exist more laws and directives, these are the most stringent laws
around online privacy. So as a rule of thumb if you comply with these laws, 
you comply with all other weaker laws. Without going into to much detail, 
the gist of the laws is, before you collect data about your users and hand it of 
to third parties, you need to get explicit and informed consent for doing so. 

> But I have a static blog, I am not collecting any data, right? I don't need
> a cookie and privacy banner.

<!--more-->

That is the issue, things we have considered normal and useful features of the 
interconnected web actually leak private info. Services that clearly need
explicit consent are:

- embedded YouTube video
- Google Analytics
- Facebook Like Button
- embedded Tweet
- advertising integration

But that is not all, for example if we hand control to third parties, we are
not entirely sure what they are doing and which kind of data they are collecting. 
These include:

- Google Font API
- third party Content Distribution Networks, such as cndjs.
- embedded Pictures
- AWS S3 hosting

They may be beging and today their privacy policies may be ok. But they still 
pose a certain remaining risk, as either the companies may change their policies,
not follow their policies and generally "sharing data with third parties" is 
already a core tenet that need consent.

The key issue here is what is personal data? Well we know that merely collecting  
browsing history is already sufficient to violate GDPR. This is where Google
Analytics got into the hot seat and back out again. They are collecting 
aggregated personal data; which would be ok, if they would not also collect 
transitively personal data.

The other issue is what is informed consent? We know the consent popup is 
informed consent; but in all implementation that banner is coming a bit late,
since following a strict interpretation, merely serving the website allows the 
HTTP server to collect a limited set of personal data. Luckily we have some 
leeway here, technical data required to operate the website may be transmitted 
and transitively stored, as long as it is within the scope of the expected 
operation. In other words if you click a link to a website, you expect the 
website to be served to you, you don't expect Facebook to also know about this. 

To get your website be entirely free of the annoying consent banner we need to 
do the following: 

1. Remove all services that need consent. 
2. Limit third party services that may be benign.

Task 2 may not be entirely necessary, but is strongly encouraged. Your user 
expects your website to be served from your service provider, without storing
any data, but not nessesarily a plethora of third party domains; with uncertain
data privacy policies.

Let's start with task 2, as that is quite simple:

### Get rid of third party CDNs

Well, this actually half goes against the grain of what web developers have 
done for quite some while. But this is actually half a good thing. For one
you should use a CDN, like [Cloud Flare][4] anyway, which should make loading of
content fast. Second this makes your website more stable as it allows you to
have all bits and bobs in one place, both when testing locally and when coming
back to it in a decade or two.

So download all the JS, CSS and images and place them next to your content. 

### Google Fonts

Although this is "just" moving content from a third part CDN to yours, the 
Google Fonts are simply available in the Google API form. 

First you can download the font directly from Google, such as [Raleway][5]. 
If you like you can convert the fonts to web fonts or be lazy like me and just
leave them in their TrueType format.

Now you need to mimic Google's CSS:

    @font-face {
      font-family: 'Raleway';
      font-style: normal;
      font-weight: 300;
      src: url(/fonts/Raleway-Light.ttf)  format('truetype');
    }

    @font-face {
      font-family: 'Raleway';
      font-style: normal;
      font-weight: 400;
      src: url(/fonts/Raleway-Regular.ttf)  format('truetype');
    }

    @font-face {
      font-family: 'Raleway';
      font-style: normal;
      font-weight: 600;
      src: url(/fonts/Raleway-Bold.ttf)  format('truetype');
    }

    @font-face {
      font-family: 'Raleway';
      font-style: italic;
      font-weight: 300;
      src: url(/fonts/Raleway-LightItalic.ttf)  format('truetype');
    }

    @font-face {
      font-family: 'Raleway';
      font-style: italic;
      font-weight: 400;
      src: url(/fonts/Raleway-Italic.ttf)  format('truetype');
    }

    @font-face {
      font-family: 'Raleway';
      font-style: italic;
      font-weight: 600;
      src: url(/fonts/Raleway-BoldItalic.ttf)  format('truetype');
    }

And voila! Your favorite web fonts are available. 

Actually, this might be the time to ponder if you want to follow the trend of
not using web-fonts.

### Your CDN Provider

You can't do nothing about your CDN provider. But if you are like me and use
Cloud Front you are in the clear. CF only takes technical data and transitively
stores it (unless you instruct them otherwise, by turning features on like
access logs). This is exempt from a consent, as no personally identifiable data
is being stored. All you need to do is mention the fact that you are not a multi
million dollar company and are using a third party CDN.

The coincidental benefit of a CDN is that it shields further infrastructure, such
as AWS S3 or AWS Lambda and it does not need to be further considered. (Under
the condition that you are not processing data on these services.)

Onto task 1:

### Getting Rid of Embeds the Simple Way

Well the simplest way to get rid of embeds is to simply not have them. Make a 
screen shot, save the picture locally and link to the content. 

Like the following:

<a href="https://www.instagram.com/p/CWbMQ8WKbvZ/"><img src="/media/2021-12-09-rioki-coffee.png"></a>

    <a href="https://www.instagram.com/p/CWbMQ8WKbvZ/"><img src="/media/2021-12-09-rioki-coffee.png"></a>

Now there may be some copyright issues you need to consider; but as far as I understand
it fair use applies in all cases I can think of.

For static content this works well, but once you have dynamic content, this
is disappointingly limited.

### Getting Rid of Embeds the Hard Way

Well embeds themselves are not the problem; the problem is the consent. 
But why not have both? The idea is to have a small pice of HTML and static
content with a consent text, then let the visitor click on a button and get
the embed with all the features.

Well for YouTube I implemented [yt-consent.js][6] that does exactly this:

<div class="yt-embed" data-video="-O5kNPlUV7w"></div>

    <div class="yt-embed" data-video="-O5kNPlUV7w"></div>

I will write an other post on how to use yt-consent.js to the fullest.

And before you ask, No YouTube's "privacy enhanced" embed codes [does not work in a GDPR compliant way][7].

### No Ads

I don't have ads and honestly I don't know a way how to make them GDPR compliant.

### Saying Goodby to Google Analytics

Getting rid of Google Analytics actually feels odd, but unfortunatly if you 
came this far, you need to do this last step.

But you still are not flying blind, most CDN maintain aggraded access 
statistics and this will still tell you how many people visited your site and
which pages they visited. 

If you did all these things... the consent banner can go. Your users will thank
you as this significantly reduces friction to use your site. 

[1]: https://edps.europa.eu/data-protection/our-work/publications/legislation/directive-2009136ec_en\
[2]: https://gdpr-info.eu/
[3]: https://oag.ca.gov/privacy/ccpa
[4]: https://www.cloudflare.com/
[5]: https://fonts.google.com/specimen/Raleway
[6]: https://github.com/rioki/yt-consent.js
[7]: https://stackoverflow.com/questions/61887699/gdpr-youtube-nocookie-embedded-urls-need-visitors-permission
