const path = require('path');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// 从 proto 文件加载服务描述符
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

// SayHello的实现，调用call.request为protobuf文件的请求体，将返回体通过callback函数回传至客户端。
function sayHello2(call, callback) {
    try {
        let data = 'hello ' + call.request.name + ' and city is ' + call.request.city;
        console.log(call);
        callback && callback(null, {
            message: data
        })
    } catch (err) {
        console.log('错误');
        callback && callback(err)
    }
}

function printAge2(call, callback) {
    try {
        let text = 'current age is ' + call.request.age;
        console.log(call);
        callback && callback(null, {
            text
        })
    } catch (err) {
        console.log('错误');
        callback && callback(err)
    }
}

// 服务器的启动方法
/*
1、通过 Greeter 服务描述符创建一个 Server 构造函数。
2、实现服务的方法。
3、通过调用 Server 的构造函数以及方法实现去创建一个服务器的实例。
4、用实例的 bind() 方法指定地址以及我们期望客户端请求监听的端口。
5、调用实例的 start() 方法启动一个RPC服务器。
*/
function main() {
    const server = new grpc.Server();
    server.addService(hello_proto.Greeter.service, {
        SayHello: sayHello2,
        printAge: printAge2
    });
    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('server start......')
}

main()