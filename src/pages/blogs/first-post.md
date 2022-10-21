---
layout: '../../layouts/BlogPost.astro'
title: 'First post'
description: 'this is description'
pubDate: '2022-10-07'
author: 'Shanks'
authorHref: 'https://github.com/cjinhuo'
heroImage: '/placeholder-hero.jpg'
heroImageAlt: 'heroImage'
---

# Mac - environment

```js
const initMiniProgram = () => {
  let adapter = {} as PlatformAdapterType
  const set = (platformAdapterContainers: InitialAdapterParamType) => {
    if (!getInstanceInfo().platform) throw Error(NotSupportMsg)
    if (!Array.isArray(platformAdapterContainers) || !platformAdapterContainers.length) return null

    const adapterContainer = platformAdapterContainers.find(adapterContainer => adapterContainer.platform === getInstanceInfo().platform)
    return adapterContainer && (adapter = adapterContainer.adapterCtor())
  }
  const get = () => adapter
  return [set, get] as const
}
```

This looks like a permissions issue in your home directory. To reclaim ownership of the **.npm** directory execute:

```
sudo chown -R $(whoami) ~/.npm
```

- [原生小程序监控的原理](https://bytedance.feishu.cn/wiki/wikcnsGzj9SfmgofAEIR1w1W0Eg#doxcnoSw8KIcYE0eQnF1EeTM5ba)
