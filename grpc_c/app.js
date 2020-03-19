const path = require('path');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.resolve(__dirname, 'protos/proto.proto');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {
    console.log('client start.......')
    // 调用 Greeter 的存根构造函数，指定服务器地址和端口。
    const client = new hello_proto.Greeter('127.0.0.1:50051', grpc.credentials.createInsecure());

    // 构造调用服务的方法：使用事件或者回调函数去获得结果
    function getMessage(error, response) {
        if (error) {
            console.log(error);
            return;
        }
        console.log('Greeting: ', response.message)
    }

    function getText(error, response) {
        if (error) {
            console.log(error);
            return;
        }
        console.log('Text is : ', response.text)
    }

    // 调用存根上的方法，传入请求和回调函数
    client.sayHello({
        name: 'locy',
        city: '西安华讯科技'
    }, getMessage);
    client.printAge({
        age: '45'
    }, getText)
}

main()