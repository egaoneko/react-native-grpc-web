import React, { useState } from 'react';

import {Button, Text, View} from 'react-native';

import { GreeterClient } from 'proto-ts/lib/helloworld_pb_service';
import { HelloRequest } from 'proto-ts/lib/helloworld_pb';

export default () => {
  const [response, setResponse] = useState('');

  async function onGreet() {
    const service = new GreeterClient('http://192.168.1.79:9000');
    try {
      const request = new HelloRequest();
      request.setName('World');
      const metadata = { 'custom-header-1': 'value1' };
      service.sayHello(request, metadata, (err: any, res: any) => {
        console.log(err, res);
        setResponse(
          (res && res.toObject() && JSON.stringify(res.toObject())) ||
            (err && err.message),
        );
      });
    } catch (e) {
      console.error(e);
    }
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
