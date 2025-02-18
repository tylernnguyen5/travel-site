exports.handler = function(event, context, callback) {
  let secretContent = `
    <h3>Welcome To the Secret Area</h3>
    <p>Here we can tell you that the sky is <strong>blue </strong>, and two plus two is four.</p>
  `;

  let body;

  if (event.body) {
    body = JSON.parse(event.body);
  } else {
    body = {};
  }

  if (body.password == 'javascript') {
    callback(null, {
      statusCode: 200,
      body: secretContent
    })    
  } else {
    callback(null, {
      statusCode: 401   // Unauthorized
    })
  }
}