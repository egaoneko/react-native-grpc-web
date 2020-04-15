import React, { useState } from 'react';

import { GreeterClient } from 'proto-ts/lib/helloworld_pb_service';
import { HelloRequest } from 'proto-ts/lib/helloworld_pb';

export default () => {
  const [response, setResponse] = useState('');

  async function onGreet() {
    const service = new GreeterClient('http://localhost:9000');
    try {
      const request = new HelloRequest();
      request.setName('World');
      const metadata: any = { 'custom-header-1': 'value1' };
      service.sayHello(request, metadata, (err: any, res: any) => {
        console.log(err, res);
        setResponse(
          (res && res.toObject() && JSON.stringify(res.toObject())) ||
            (err && err.message)
        );
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <p>Greet the world?</p>
      <button onClick={() => onGreet()}>Greet!</button>
      <p>{response}</p>
    </div>
  );
};
