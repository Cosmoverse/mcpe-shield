import { env } from "cloudflare:workers"

declare global {
	interface Env extends Cloudflare.Env {
		LAMBDA_URL: string
	}
}

async function query(url: string){
	const udp = new URL(`udp://${url}`)
	const response = await fetch(`${env.LAMBDA_URL}/${udp.hostname}:${udp.port || 19132}`, {
		cf: {cacheEverything: true, cacheTtl: 180}
	})
	if(!response.ok) throw Error("Failed to fetch")
	const data = await response.bytes()
	const p = new TextDecoder().decode(data.slice(61)).split(";")
	return {
		edition: p[0],
		motd: p[1].replace(/§[0-9a-fk-or]/gi, ""),
		protocol: +p[2],
		version: p[3],
		players: +p[4],
		maxPlayers: +p[5],
		serverId: p[6],
		subMotd: p[7].replace(/§[0-9a-fk-or]/gi, ""),
		gamemode: p[8],
		gamemodeId: +p[9],
		portIpv4: +p[10],
		portIpv6: +p[11],
	}
}

export default {

	async fetch(request, env, ctx){
		if(request.method !== "GET") return new Response("Not Found", { status: 404 })

		const url = new URL(request.url)
		if(url.pathname.startsWith("/ping")){
			try{
				return Response.json(await query(decodeURIComponent(url.pathname.slice(6))), { headers: {"Access-Control-Allow-Origin": "*"} })
			}catch{
				return new Response("Service Unavailable", { status: 503, headers: {"Access-Control-Allow-Origin": "*"} })
			}
		}

		const [target, color, label, status, offlineLabel, offlineStatus] = decodeURIComponent(url.pathname.slice(1)).split("-")
		let data
		try{
			data = await query(target)
		}catch{
			return Response.json({schemaVersion: 1, label: offlineLabel || target, message: offlineStatus || "offline", color: "red"})
		}
		const format = (s: string) => s.replace(/'(\w+)'/g, (_, key) => String(data[key as keyof typeof data] ?? ""))
		return Response.json({
			schemaVersion: 1,
			label: format(label || "'motd'"),
			message: format(status || "v'version'"),
			color: color || "brightgreen",
		})
	}
} satisfies ExportedHandler<Env>
