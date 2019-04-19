var apiKey = "46312732";
var sessionId = "2_MX40NjMxMjczMn5-MTU1NTYzOTc0MzQ2M35CWU1uVjVjN2haalJUTEVwS3NXZk9jY2N-fg";
var token = "T1==cGFydG5lcl9pZD00NjMxMjczMiZzaWc9MzZjYTFiMWI1ZmMyOWQ1OGRiODU5ZTVlYzAyZTlhOWYyYzQ3M2RkZDpzZXNzaW9uX2lkPTJfTVg0ME5qTXhNamN6TW41LU1UVTFOVFl6T1RjME16UTJNMzVDV1UxdVZqVmpOMmhhYWxKVVRFVndTM05YWms5alkyTi1mZyZjcmVhdGVfdGltZT0xNTU1NjM5Nzc3Jm5vbmNlPTAuMTE2NjQ2ODM2MzY5Mzg1NTUmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTU1ODIzMTc3NyZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==";

initializeSession();

function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
  session.subscribe(event.stream, 'subscriber', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);
});
  // Create a publisher
  var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
}
