/// <reference types="@cloudflare/workers-types" />
interface Env extends Cloudflare.Env {
	LAMBDA_URL: string
}

export default {
	async fetch(request, env, ctx){
		const [target, color, label, status, offlineLabel, offlineStatus] = decodeURIComponent(new URL(request.url).pathname.slice(1)).split("-")
		let data
		try{
			const udp = new URL(`udp://${target}`)
			const response = await fetch(env.LAMBDA_URL, { method: "POST", body: `${udp.hostname}:${udp.port || 19132}` })
			if(!response.ok) throw Error("Failed to fetch")
			data = await response.bytes()
		}catch{
			return Response.json({schemaVersion: 1, label: offlineLabel || target, message: offlineStatus || "offline", color: "red"})
		}
		const p = new TextDecoder().decode(data.slice(35)).split(";")
		const result = {
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
		const format = (s: string) => s.replace(/'(\w+)'/g, (_, key) => String(result[key as keyof typeof result] ?? ""))
		return Response.json({
			schemaVersion: 1,
			label: format(label || "'motd'"),
			message: format(status || "v'version'"),
			color: color || "brightgreen",
		})
	}
} satisfies ExportedHandler<Env>