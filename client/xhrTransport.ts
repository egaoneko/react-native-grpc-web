import {grpc} from '@improbable-eng/grpc-web';
import detach from './detach';

declare const XMLHttpRequest: any;

class XHR implements grpc.Transport {
  options: grpc.TransportOptions;
  xhr: any = null;
  metadata: grpc.Metadata | null = null;

  constructor(transportOptions: grpc.TransportOptions) {
    this.options = transportOptions;
  }

  onLoadEvent() {
    const result = new Uint8Array(this.xhr.response);
    detach(() => {
      this.options.onChunk(result);
    });
    detach(() => {
      this.options.onEnd();
    });
  }

  onStateChange() {
    if (this.xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
      detach(() => {
        this.options.onHeaders(
          new grpc.Metadata(this.xhr.getAllResponseHeaders()),
          this.xhr.status,
        );
      });
    }
  }

  sendMessage(msgBytes: Uint8Array) {
    this.xhr.send(msgBytes);
  }

  finishSend() {}

  start(metadata: grpc.Metadata) {
    this.metadata = metadata;
    const xhr = new XMLHttpRequest();
    this.xhr = xhr;
    xhr.open('POST', this.options.url);
    (xhr as any).responseType = 'arraybuffer';
    this.metadata.forEach((key, values) => {
      xhr.setRequestHeader(key, values.join(', '));
    });
    xhr.addEventListener('readystatechange', this.onStateChange.bind(this));
    xhr.addEventListener('loadend', this.onLoadEvent.bind(this));
    xhr.addEventListener('error', (err: any) => {
      detach(() => {
        this.options.onEnd(err.error);
      });
    });
  }

  cancel() {
    this.xhr.abort();
  }
}

export default function xhrTransport(
  options: grpc.TransportOptions,
): grpc.Transport {
  return new XHR(options);
}
