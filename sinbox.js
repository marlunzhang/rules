const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['🐸 手动切换', '♻️ 自动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['🎬 Emby'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /(JP|US).*0[.]20x/i))
  }
  if (['🇭🇰 香港节点', '🇭🇰 香港自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇭🇰|HK|hk|香港|港|HongKong/i))
  }
  if (['🇹🇼 台湾节点', '🇹🇼 台湾自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇹🇼|TW|tw|台湾|台|Taiwan/i))
  }
  if (['🇯🇵 日本节点', '🇯🇵 日本自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇯🇵|JP|jp|日本|日|Japan/i))
  }
  if (['🇰🇷 韩国节点', '🇰🇷 韩国自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇰🇷|KR|韩|韩国|Korea/i))
  }
  if (['🇸🇬 新加坡节点', '🇸🇬 新加坡自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇸🇬|SG|sg|新加坡|狮城|Singapore/i))
  }
  if (['🇺🇲 美国节点', '🇺🇲 美国自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇺🇸|US|us|美国|美|United States/i))
  if (['♻️ 低倍自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /0.1x|0.20x|0.50x/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
