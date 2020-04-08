# Tier List Maker
A website to create Tier Lists about anything and browse other user made Tier Lists
## Website
Click on this link: [https://tierlist-57d59.web.app](https://tierlist-57d59.web.app)

**NOT MOBILE FRIENDLY**

**STILL A WORK IN PROGRESS**

## Cors Error / Quota exceeded Error / Why are things not loading?
Since I'm using the free version of the Firebase Cloud Functions, it limits the number of API calls per 100 seconds. So, if you use the functionalities of the website really quickly (e.g. switching pages quickly, liking and unliking rapidly), it will stop the API call. There will be stuff that won't load on the page and the console will show you (client side) a Cors Error. It is not a Cors Error, it is a Quota Exceeded Error but the console will show a Cors Error for some reason.

If you run into this problem, you simply need to wait a little bit before continuing to use the website since it only checks the quota every 100 seconds.

## Missing Features (to be implemented in the near future)
* Make the page titles look better
* Finish the likes tab in the profile page
* Search for users page
* Fix the style of the notifications
* Adding 3 views for the Tier List page (Detailed, Simple, Classic)
* Categories page
* Implement forget password? in Login
* Allow users to change password
* Make the HTML title change with different pages
* Mobile Friendly
## Motivation
This was one of my project ideas I was planning to do in summer. However, with all this free time I got because of the pandemic, I've decided to dedicate all my time on this project rather than doing nothing.

The second reason is because I got some friends who asked me for new animes to watch and I got tired of telling them my entire list of anime recommendations and explaining one by one on why each are placed in that specific ranking. So, I decided make an entire website just to show my anime rankings because why not 🤷‍♂️

The main website for Tier Lists (https://tierlists.com) lets you rank different items. However, it doesn't let you explain the reason why they're in that tier so user who are casually browsing your Tier Lists won't understand why things are ordered that way. My website is the solution to that specific problem since it lets the user write down their thoughts and opinions on each tier item in the Tier List.