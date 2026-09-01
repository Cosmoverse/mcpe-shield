<div align="center">
  <h3>mcpe-shield</h3>
</div>
<div align="center">
  <a href="https://mcpe-shield-ui.cosmicpe.dev"><img src="https://img.shields.io/badge/Demo_site-mcpe&hyphen;shield&hyphen;ui.cosmicpe.dev-blue" alt="License"/></a>
  <a href="https://github.com/Cosmoverse/mcpe-shield/blob/master/LICENSE"><img src="https://img.shields.io/github/license/Cosmoverse/mcpe-shield?v=3" alt="License"/></a>
</div>
<p align="center">
  Shields.io-compatible badges for your Minecraft: Bedrock Edition server.
</p>


## Usage

Point Shields.io at `badge.cosmicpe.dev`, tell it which Bedrock server to ping, and boom: tidy little status badge for your README, website, or server list.

```md
![Server status](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/<host>:<port=19132>)
```

Example:

```md
![Hub](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/play.cosmicpe.me:19132)
```
![Hub](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/play.cosmicpe.me:19132)


That gives you a badge with the server MOTD and the Minecraft version. An intuitive badge builder is available at https://mcpe-shield-ui.cosmicpe.dev.

## Custom badges

The full badge path looks like this:

```txt
https://badge.cosmicpe.dev/<target>-<colour>-<label>-<message>-<offline-label>-<offline-message>
```

| Bit | What it does | Default |
| --- | --- | --- |
| `<target>` | Server address, like `play.example.net:19132` | Required |
| `<colour>` | Shields.io colour, like `blue`, `green`, `yellow`, or `ff69b4` | `brightgreen` |
| `<label>` | Left side of the badge | Server MOTD |
| `<message>` | Right side of the badge | `v<version>` |
| `<offline-label>` | Left side when the server cannot be reached | Target address |
| `<offline-message>` | Right side when the server cannot be reached | `offline` |

Leave a bit empty if you want the default. For example, this keeps the default colour but changes the label:

```md
![Demo server](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/cannon.cosmicpe.me:19132--Demo%2520server)
```
![Demo server](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/cannon.cosmicpe.me:19132--Demo%2520server)

Mind the hyphens: the endpoint uses `-` to split the path, so keep hyphens out of the custom bits.

## Placeholders

You can drop live server values into the label or message by wrapping a field name in single quotes:

```md
![Players](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/cannon.cosmicpe.me:19132-blue-Cannon%2520Planet-'players'%252F'maxPlayers'%2520players)
```
![Players](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/cannon.cosmicpe.me:19132-blue-Cannon%2520Planet-'players'%252F'maxPlayers'%2520players)

Available fields:

| Placeholder | Meaning |
| --- | --- |
| `'edition'` | Bedrock edition string |
| `'motd'` | Main MOTD, with Minecraft colour codes stripped |
| `'protocol'` | Protocol number |
| `'version'` | Minecraft version |
| `'players'` | Current player count |
| `'maxPlayers'` | Max player count |
| `'serverId'` | Server ID |
| `'subMotd'` | Sub-MOTD, also cleaned up |
| `'gamemode'` | Gamemode name |
| `'gamemodeId'` | Gamemode ID |
| `'portIpv4'` | Reported IPv4 port |
| `'portIpv6'` | Reported IPv6 port |

## Examples

Version and player count:

![](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/cannon.cosmicpe.me:19132--Cannon%2520Planet-v'version'%2520('players'/'maxPlayers'))

```md
![Version and players](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/cannon.cosmicpe.me:19132--Cannon%2520Planet-v'version'%2520('players'/'maxPlayers'))
```

Blue badge with a custom label:

![](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/cannon.cosmicpe.me:19132-blue-cannon.cosmicpe.me-v'version')

```md
![Blue version badge](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/cannon.cosmicpe.me:19132-blue-cannon.cosmicpe.me-v'version')
```

Offline fallback:

![](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/cannon.cosmicpe.me:19123----Demo%2520server)

```md
![Offline fallback](https://img.shields.io/endpoint?url=https://badge.cosmicpe.dev/cannon.cosmicpe.me:19123----Demo%2520server)
```

## URL encoding

Because the badge URL is passed inside another URL, spaces and symbols need encoding. Use `%2520` for a space in labels/messages. If in doubt, paste your finished badge endpoint into a URL encoder once, then put that encoded value after `?url=`.