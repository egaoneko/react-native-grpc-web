import React, { useState } from 'react';

import * as helloworld from './helloworld/helloworld_grpc_web_pb';

export default () => {
  const [response, setResponse] = useState('');
  
  async function onGreet() {
    const helloService = new helloworld.GreeterClient('http://localhost:50050');
    try {
      const request = new helloworld.HelloRequest();
      request.setName('World');
      const metadata = {'custom-header-1': 'value1'};
      const call = helloService.sayHello(
        request,
        metadata,
        (err: any, res: any) => {
          console.log(err, res);
          setResponse(res || (err && err.message));
        },
      );

      call.on('status', (status: any) => {
        console.log(status.code);
        console.log(status.details);
        console.log(status.metadata);
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <p>
        Greet the world?
      </p>
      <button onClick={() => onGreet()}>Greet!</button>
      <p>{response}</p>
    </div>
  );
}
