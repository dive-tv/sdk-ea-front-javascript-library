# ea-front-sdk-js
Dive Experience Amplifier front sdk for Javascript

## Introduction

Dive provides a series of frontend SDK for the most common client programming languages which can be added as libraries on the client side.

The frontend SDK library provides a GUI which leverages displaying the context card real time stream and the detailed view of each card category.


NOTE: this document is being updated on a regular base and contents are subject to change.

## Integration Methods

The following sections describe the different functions that SDK contains to integrate a client SW using Dive Front SDK.

- Import SDK with npm -> npm i -S @dive-tv/sdk-ea-front-javascript-library
- Import in js document -> var DiveSDK = require('@dive-tv/sdk-ea-front-javascript-library'); 
- Authentication details are provided in the library initialization
- API calls are performed calling library methods
- Response statuses and objects are mapped to native objects of the library implementation language.

### Initialize
````javascript
initialize(selector, apiKey, userId, locale)
````
Initializes the library with the specified configuration

#### Parameters:

Class | Method | HTTP request 
------------ | ------------- | -------------
*selector* | *String* | *HTML selector* 
*user_id* | *String* | *unique id that tracks a unique client of your service* 
*api_key* | *String* | *client api key provided by Dive*
*locale* | *locale* | *language*

#### Return:
N/A

#### Example:
````javascript
var selector = "#container"
var apiKey = "client_api_key_example"; // String | Client api key provided by Dive
var userId = "user_id_example"; // String | Unique id that tracks a unique client of your s
var locale = "locale_example"; // String | Language to setup  texts of the UI and contents 

DiveSDK.initialize(selector, apiKey, userId, locale);

````

### Movie sync availability
````javascript
vodIsAvailable(movieId)
````
Checks if the movie/chapter is available to be synchronized using the Dive API

#### Parameters:

Name | Type | Description 
------------ | ------------- | ------------- 
*movieId* | *String* | *requested movies identifier* 

#### Return:
Promise => (boolean)


#### Example:
````javascript
var clientMovieId = "clientMovieIdList_example"; // String | client movie ID
var result = DiveSDK.vodIsAvailable(clientMovieId).then((val) => {
      console.log("vod Is Available: ", val);
});
````

### Movie Start
````javascript
vodStart(movieId, timestamp, videoRef)
````
Initializes the synchronization and Carousel with a VOD content

#### Parameters:

Name | Type | Description 
------------ | ------------- | ------------- 
*movieId* | *String* | *requested movie identifier* 
*timestamp* | *Integer* | *Current time in seconds of the media content*
*videoRef* | *(optional) HTMLVideoElement* | *HTML Video element to link the videoevents.*

#### Return:
Type | Description 
------------ | -------------
Null | --------------

#### Example:
````javascript
var clientMovieId = "clientMovieId_example"; // String | client movie ID
var timestamp = 0; //Integer | timestamp in seconds
var videoRef = document.getElementById('video');

DiveSDK.vodStart(clientMovieId, timestamp);
or
DiveSDK.vodStart(clientMovieId, timestamp, videoRef);
````

### Movie Start (Vimeo)
````javascript
vodVimeoStart(movieId, timestamp, videoRef)
````
Initializes the synchronization and Carousel with a VOD content for Vimeo video embedded

#### Parameters:

Name | Type | Description 
------------ | ------------- | ------------- 
*movieId* | *String* | *requested movie identifier* 
*timestamp* | *Integer* | *Current time in seconds of the media content*
*videoRef* | *HTMLVideoElement* | *HTML Video element to link the videoevents.*

#### Return:
Type | Description 
------------ | -------------
Null | --------------

#### Example:
````javascript
var clientMovieId = "clientMovieId_example"; // String | client movie ID
var timestamp = 0; //Integer | timestamp in seconds
var videoRef = document.getElementById('video');

DiveSDK.vodVimeoStart(clientMovieId, timestamp, videoRef);
````

### Pause
````javascript
vodPause()
````
Notifies to the library that the player has been paused

#### Parameters:
N/A

#### Return:
N/A

#### Example:
````javascript
DiveSDK.vodPause();
````

### Resume
````javascript
vodResume(timestamp)
````
Notifies to the library that the player has been resumed

#### Parameters:

Name | Type | Description 
------------ | ------------- | ------------- 
*timestamp* | *Integer* | *Current time in seconds of the media content* 

#### Return:
N/A

#### Example:
````javascript
    DiveSDK.vodResume(timestamp);
````

### Seek
````javascript
vodSeek(timestamp)
````
Notifies to the library that the player has changed the time (seeking/jumping)

#### Parameters:

Name | Type | Description 
------------ | ------------- | ------------- 
*timestamp* | *Integer* | *Current time in seconds of the media content* 

#### Return:
N/A

#### Example:
````javascript
    DiveSDK.vodSeek(newTimestamp);
   
````

### Finish 
````javascript
vodEnd()
````
Removes the carousel and disconnects the synchronization socket

#### Parameters:
N/A

#### Return:
N/A

#### Example:
````javascript
    DiveSDK.vodEnd();
````

### Channel sync availability
````javascript
channelIsAvailable(channelId)
````
Checks if the channel is available to be synchronized using the Dive API

#### Parameters:

Name | Type | Description 
------------ | ------------- | ------------- 
*channelId* | *Id of available channel* | *requested channel identifier* 

#### Return:
Promise => (boolean)


#### Example:
````javascript
var channelId = "TVE"; // String | channel ID
var result = DiveSDK.channelIsAvailable(channelId).then((val) => {
      console.log("Channel Is Available: ", val);
});
````

### TV Start
````javascript
tvStart(channelId)
````
Initializes the synchronization and Carousel with a Linear TV channel content

#### Parameters:

Name | Type | Description 
------------ | ------------- | ------------- 
*channelId* | *String* | *requested channel identifier* 

#### Return:
Type | Description 
------------ | -------------
Null | -----------

#### Example:
````javascript
diveFragment = DiveSDK.tvStart(channelId);
````

## How to use
- Import npm package

````npm
npm i -S @dive-tv/sdk-ea-front-javascript-library
````

- DiveSDK is already enabled on your project.

## Author



