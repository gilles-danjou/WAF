Wakanda Application Framework
===

While Wakanda Server does much of the “heavy lifting” in order to provide a fast back end for your applications, it requires an advanced framework on the client side to keep things running smoothly. The Wakanda Framework is comprised of a data provider to communicate with the server, interface widgets for the browser-based front end, and a datasource that comes in between.

### Communicating with the Server

Wakanda’s data provider communicates directly with the datastore on the server, typically via JSON and REST, assisted by JavaScript. The data provider handles the local cache and parsing of the data on the client, and by way of its lightweight nature, loads only the necessary data into memory. 

### Communicating with the User Interface

Data is then passed on to the datasource. Using the inherent datastore class, the datasource sends and receives data to and from the appropriate interface widget. A datasource can also handle local JavaScript variables that aren't necessarily bound to data on Wakanda Server – and can display them alongside your server-based data.

### GUI Elements

Widgets are the actual interface elements – based on HTML5, CSS3 and JavaScript – that end-users manipulate to send, receive, view or modify data. While a variety of widgets are available by default in Wakanda Studio, you can modify widgets as much as you please, or create your own. The widgets run on top of a version of jQuery included with Wakanda, and by adding additional libraries, more GUI elements can be created and bound to Wakanda’s logic.

Because the widgets are entirely standards-based and constructed of pure DOM elements, the final HTML page can be further customized and even animated using any other existing frameworks with which you are familiar. In those instances you don't want to use a widget, you can also directly access the dataprovider with JavaScript code, giving you a faceless way to interact with server data.

### Performance

The key to Wakanda’s high-performance front end is non-verbose data transfer, resulting in fast, responsive clients that meet and sometimes surpass the performance of native applications. Therefore, using Wakanda solutions can be as easy and fun as developing them!

Resources
---
  - [Wakanda.org](http://wakanda.org)
  - [The Documentation](http://doc.wakanda.org)
  - [The Forum](http://forum.wakanda.org)
  