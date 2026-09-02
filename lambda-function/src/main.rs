use std::{net::ToSocketAddrs, time::Duration};
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use tokio::{net::UdpSocket, time::timeout};

const PING_PACKET: &[u8] = b"\x01\0\0\0\0\0\0\0\0\x00\xff\xff\x00\xfe\xfe\xfe\xfe\xfd\xfd\xfd\xfd\x12\x34\x56\x78\0\0\0\0\0\0\0\0";

async fn handler(request: Request) -> Result<Response<Body>, Error> {
    let target = request.uri().path().trim_start_matches('/').trim();
    let address = target.to_socket_addrs()?.next().ok_or("no address")?;
    let socket = UdpSocket::bind(if address.is_ipv6() { "[::]:0" } else { "0.0.0.0:0" }).await?;
    socket.send_to(PING_PACKET, address).await?;
    let mut buffer = [0; 2048];
    let (len, _) = timeout(Duration::from_secs(3), socket.recv_from(&mut buffer)).await??;
    Ok(Response::new(Body::Binary(buffer[..len].to_vec())))
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Error> {
    run(service_fn(handler)).await
}
