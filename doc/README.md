# ea-front-sdk-js
Dive Experience Amplifier front sdk for Javascript

## Introduction

Dive provides a series of frontend SDK for the most common client programming languages which can be added as libraries on the client side.

The frontend SDK library provides a GUI which leverages displaying the context card real time stream and the detailed view of each card category.


NOTE: this document is being updated on a regular base and contents are subject to change.

## Integration Methods

The following sections describe the different functions that SDK contains to integrate a client SW using Dive Front SDK.

- Import SDK with npm ->
- Authentication details are provided in the library initialization
- API calls are performed calling library methods
- Response statuses and objects are mapped to native objects of the library implementation language.

### Initialize
````javascript
initialize(user_id, api_key, context)
````
Initializes the library with the specified configuration

#### Parameters:

Class | Method | HTTP request 
------------ | ------------- | ------------- 
*user_id* | *String* | *unique id that tracks a unique client of your service* 
*api_key* | *String* | *client api key provided by Dive*
*context* | *Context* | *context where the fragment will be inflated*

#### Return:
N/A

#### Example:
````javascript
var selector = "#container"
var apiKey = "client_api_key_example"; // String | Client api key provided by Dive
var userId = "user_id_example"; // String | Unique id that tracks a unique client of your s
var locale = "locale_example"; // String | Language to setup  texts of the UI and contents 

DiveSDK.front.initialize.initialize(selector, apiKey, userId, locale);

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
var result = DiveSDK.front.vodIsAvailable(clientMovieId).then((val) => {
      console.log("vod Is Available: ", val);
});
````

### Movie Start
````javascript
Fragment vodStart(movieId, timestamp)
````
Initializes the synchronization and Carousel with a VOD content

#### Parameters:

Name | Type | Description 
------------ | ------------- | ------------- 
*movieId* | *String* | *requested movie identifier* 
*timestamp* | *Integer* | *Current time in seconds of the media content*

#### Return:
Type | Description 
------------ | -------------
Fragment | Fragment with carousel loaded. Minimum container’s height must be 162.5dp

#### Example:
````javascript
DiveSDK diveSDK = new DiveSDK();
String clientMovieId = "clientMovieId_example"; // String | client movie ID
Integer timestamp = 0; //Integer | timestamp in seconds
try {
    Fragment diveFragment = diveSDK.vodStart(clientMovieId, timestamp);
   } catch (ApiException e) {
    System.err.println("Exception when calling DiveSDK#vodStart");
    e.printStackTrace();
}
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
DiveSDK diveSDK = new DiveSDK();
try {
    diveSDK.vodPause();
   } catch (ApiException e) {
    System.err.println("Exception when calling DiveSDK#vodPause");
    e.printStackTrace();
}
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
DiveSDK diveSDK = new DiveSDK();
try {
    diveSDK.vodResume(timestamp);
   } catch (ApiException e) {
    System.err.println("Exception when calling DiveSDK#vodResume");
    e.printStackTrace();
}
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
DiveSDK diveSDK = new DiveSDK();
Integer newTimestamp = 0; //Integer | timestamp in seconds
try {
    diveSDK.vodSeek(newTimestamp);
   } catch (ApiException e) {
    System.err.println("Exception when calling DiveSDK#vodSeek");
    e.printStackTrace();
}
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
DiveSDK diveSDK = new DiveSDK();
try {
    diveSDK.vodEnd();
   } catch (ApiException e) {
    System.err.println("Exception when calling DiveSDK#vodEnd");
    e.printStackTrace();
}
````

### Channel sync availability
````javascript
channelIsAvailable(channelId, callback)
````
Checks if the channel is available to be synchronized using the Dive API

#### Parameters:

Name | Type | Description 
------------ | ------------- | ------------- 
*channelId* | *List<String>* | *requested channels identifier* 
*callback* | *ClientCallBack* | *Callback for receive response*

#### Return:
N/A

#### Example:
````javascript
DiveSDK diveSDK = new DiveSDK();
ClientCallback callback = new ClientCallback() {
	@Override
	public void onFailure(RestAPIError message) {
		//channel is not available
	}

	@Override
	public void onSuccess(Object result) {
		//channel is available
	}
};
List<String> channels = Arrays.asList("tve1", "tnt");
try {
    diveSDK.channelIsAvailable(clientChannelId, callback);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DiveSDK#channelIsAvailable");
    e.printStackTrace();
}
````

### TV Start
````javascript
Fragment tvStart(channelId)
````
Initializes the synchronization and Carousel with a Linear TV channel content

#### Parameters:

Name | Type | Description 
------------ | ------------- | ------------- 
*channelId* | *String* | *requested channel identifier* 

#### Return:
Type | Description 
------------ | -------------
Fragment | Fragment with carousel loaded. Minimum container’s height must be 162.5dp

#### Example:
````javascript
DiveSDK diveSDK = new DiveSDK();
String clientChannelId = "clientChannelId_example"; // String | client movie ID
try {
    Fragment diveFragment = diveSDK.TVStart(channelId);

    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DiveSDK#tvStart");
    e.printStackTrace();
}
````

## How to use
- Include SDK Client and SDK Front to a project

    - Add dependency into your app build.gradle file

        ```java
        
        dependencies {
            ...
           compile 'com.github.dive-tv:ea-front-sdk-android:1.0.9'
           compile 'com.github.dive-tv:ea-client-sdk-android:1.0.6'
           compile 'com.github.dive-tv:sdk-client-java:1.0.6'
        
        }
        ```
    - Add repository into your app build.gradle file
        ```java
        repositories {
            ...
            jcenter()
            maven { url "https://jitpack.io" } 
        }
        ```
    - Add repository into your root build.gradle file
        ````javascript
        dependencies {
            classpath 'com.github.dcendents:android-maven-gradle-plugin:2.0' 
        }
        ````

- Main activity should extend from DiveActivity
- Main activity should implement DiveActivity.OnDiveInteractionListener
- An example app using Dive SDK is in the following Github repository: https://github.com/dive-tv/ea-test-android
    - App works with app.properties file into assets folder. This file should be contain this line: api.key=YOUR_API_KEY
    - Change YOUR_API_KEY by provided value


## Author



