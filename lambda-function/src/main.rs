use std::{net::{ToSocketAddrs, UdpSocket}, time::Duration};
use lambda_http::{http::Method, run, service_fn, Body, Error, Request, Response};

const P: &[u8] = b"\x01\0\0\0\0\0\0\0\0\x00\xff\xff\x00\xfe\xfe\xfe\xfe\xfd\xfd\xfd\xfd\x12\x34\x56\x78\0\0\0\0\0\0\0\0";

async fn f(r: Request) -> Result<Response<Body>, Error> {
    let x = r.uri().path().trim_start_matches('/').trim();
    let a = x.to_socket_addrs()?.next().ok_or("no address")?;
    let s = UdpSocket::bind(if a.is_ipv6() { "[::]:0" } else { "0.0.0.0:0" })?;
    s.set_read_timeout(Some(Duration::from_secs(3)))?;
    s.send_to(P, a)?;
    let mut b = [0; 2048];
    let (n, _) = s.recv_from(&mut b)?;
    Ok(Response::new(Body::Binary(b[..n].to_vec())))
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Error> {
    run(service_fn(f)).await
}