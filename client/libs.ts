import { grpc } from '@improbable-eng/grpc-web';
import { ReactNativeTransport } from '@improbable-eng/grpc-web-react-native-transport';
grpc.setDefaultTransport(ReactNativeTransport({ withCredentials: true }));