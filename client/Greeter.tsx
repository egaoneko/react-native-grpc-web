import React, { useState } from 'react';

import {Button, Text, View} from 'react-native';

import { grpc } from '@improbable-eng/grpc-web';
import { ReactNativeTransport } from './ReactNativeTransport';
grpc.setDefaultTransport(ReactNativeTransport());

import { Greeter } from './helloworld/helloworld_pb_service';
import { HelloRequest } from './helloworld/helloworld_pb';

export default () => {
  const [response, setResponse] = useState('');
  
  async function onGreet() {
    console.log(Greeter.SayHello, HelloRequest);

    const helloRequest = new HelloRequest();
    helloRequest.setName('World');
    grpc.unary(Greeter.SayHello, {
      request: helloRequest,
      host: 'http://localhost:50050',
      onEnd: res => {
        console.log(res);
      }
    });
    // const helloService = new helloworld.GreeterClient('http://localhost:50050');
    // try {
    //   const request = new helloworld.HelloRequest();
    //   request.setName('World');
    //   const metadata = {'custom-header-1': 'value1'};
    //   const call = helloService.sayHello(
    //     request,
    //     metadata,
    //     (err, res) => {
    //       console.log(err, res);
    //       setResponse(res || (err && err.message));
    //     },
    //   );

    //   call.on('status', function(status) {
    //     console.log(status.code);
    //     console.log(status.details);
    //     console.log(status.metadata);
    //   });
    // } catch (e) {
    //   console.error(e);
    // }
  }

  return (
    <View>
      <Text style={{textAlign: 'center', marginTop: 20}}>
        Greet the world?
      </Text>
      <Button
        onPress={() => onGreet()}
        title="Greet!"
        color="#841584"
        accessibilityLabel="Lets hit that grpc server"
      />
      <Text style={{textAlign: 'center'}}>{response}</Text>
    </View>
  );
}
