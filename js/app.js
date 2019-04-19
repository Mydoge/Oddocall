var apiKey = "46312732";
var sessionId = "2_MX40NjMxMjczMn5-MTU1NTYzOTc0MzQ2M35CWU1uVjVjN2haalJUTEVwS3NXZk9jY2N-fg";
var token = "T1==cGFydG5lcl9pZD00NjMxMjczMiZzaWc9MzZjYTFiMWI1ZmMyOWQ1OGRiODU5ZTVlYzAyZTlhOWYyYzQ3M2RkZDpzZXNzaW9uX2lkPTJfTVg0ME5qTXhNamN6TW41LU1UVTFOVFl6T1RjME16UTJNMzVDV1UxdVZqVmpOMmhhYWxKVVRFVndTM05YWms5alkyTi1mZyZjcmVhdGVfdGltZT0xNTU1NjM5Nzc3Jm5vbmNlPTAuMTE2NjQ2ODM2MzY5Mzg1NTUmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTU1ODIzMTc3NyZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==";

var apiKey;
var session;
var sessionId;
var token;

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, function callback(error) {
      if (error) {
        console.error('There was an error publishing: ', error.name, error.message);
      }
    });
  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.error('You were disconnected from the session.', event.reason);
  });

  // Initialize the publisher
  var publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };
  var publisher = OT.initPublisher('publisher', publisherOptions, function initCallback(initErr) {
    if (initErr) {
      console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
      return;
    }
  });

  // Connect to the session
  session.connect(token, function callback(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (!error) {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, function publishCallback(publishErr) {
        if (publishErr) {
          console.error('There was an error publishing: ', publishErr.name, publishErr.message);
        }
      });
    } else {
      console.error('There was an error connecting to the session: ', error.name, error.message);
    }
  });

  // Receive a message and append it to the history
  var msgHistory = document.querySelector('#history');
  session.on('signal:msg', function signalCallback(event) {
    var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
  });
}

// Text chat
var form = document.querySelector('form');
var msgTxt = document.querySelector('#msgTxt');

// Send a signal once the user enters data in the form
form.addEventListener('submit', function submit(event) {
  event.preventDefault();

  session.signal({
    type: 'msg',
    data: msgTxt.value
  }, function signalCallback(error) {
    if (error) {
      console.error('Error sending signal:', error.name, error.message);
    } else {
      msgTxt.value = '';
    }
  });
});

// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  apiKey = API_KEY;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session').then(function fetch(res) {
    return res.json();
  }).then(function fetchJson(json) {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;

    initializeSession();
  }).catch(function catchErr(error) {
    console.error('There was an error fetching the session information', error.name, error.message);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
