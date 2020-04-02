---
title: 'VPN搭建'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: hobby
date: 2019-05-29
# 时间
tags:
- VPN
- 服务器
# 标签
---

::: tip VPN搭建步骤
1. 去国外买个服务器
2. 搭建shadowsocks（主要用于网页浏览）
3. 搭建vpn（适用于所有的client，包括browser）
:::

1. [vultr](https://my.vultr.com/)
2. `ssh root@ip`（用于mac链接linux服务器）
3. `vim /etc/ssh/sshd_config`（更改#port 22 => port 20000）
4. `reboot`
5. `ssh -p 20000 root@id`
6. `apt update`、`apt dist-upgrade`（升级系统）然后`reboot`
7. `echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf`（将net.core.default_qdisc=fq追加到sysctl.conf文件）
8. `echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf`（将net.ipv4.tcp_congestion_control=bbr追加到sysctl.conf文件）
9. `sysctl -p`（从指定的文件加载系统参数，如不指定即从/etc/sysctl.conf中加载）
10. `echo "net.ipv4.tcp_fastopen = 3" >> /etc/sysctl.conf`
11. `sysctl -p`（从指定的文件加载系统参数，如不指定即从/etc/sysctl.conf中加载）
12. `apt install shadowsocks-libev`
13. `systemctl disable shadowsocks-libev`
14. `nano /etc/shadowsocks-libev/config` (更改配置信息，其中包括密码，模式)
```js
{
  method: 'aes-256-gcm',
  port: '20001', // 随意
  "fast_open":true,
  "mode":"tcp_and_udp",
  "local_port":1080,
  "timeout":60,
}
```
15. `systemctl enable shadowsocks-libev-server@config`
16. `systemctl restart shadowsocks-libev-server@config`
17. `systemctl status shadowsocks-libev-server@config` (查看shadowsocks的状态命令)
18. 当状态正常但是本地连小飞机上不了Google的时候把config.json的server字段删除。也就是从14行开始，删除config的第一行。
## vpn
::: tip
`wget https://git.io/vpnsetup -O vpnsetup.sh && sudo sh vpnsetup.sh`<br>
:::
执行完上面的代码后，将会输出类似下面这种信息，你需要把信息保存起来。<br>
<!-- Server IP: 45.32.225.73
IPsec PSK: 6VUvVs4jGoSi87LK3dLp
Username: vpnuser
Password: 94rvmdYAj4dduNXS -->
IPsec VPN server is now ready for use!<br>
Connect to your new VPN with these details:<br>
* Server IP: 45.77.87.244




