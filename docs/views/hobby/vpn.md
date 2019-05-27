---
title: '题目名字'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: 
- hobby
# 分类 共有三个分类： frontEnd work hobby
date: 2019-02-12
# 时间
tags:
- 模板
# 标签
---

::: tip 概述

:::

1. https://my.vultr.com/
2. ssh root@ip
3. # vim /etc/ssh/sshd_config =》 更改#port 22 => port 20000
4. reboot
5. ssh -p 20000 root@id
6. 升级系统： `apt update` =》 `apt dist-upgrade`
7. `echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf`
8. `echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf`
9. `sysctl -p`
10. `echo "net.ipv4.tcp_fastopen = 3" >> /etc/sysctl.conf`
11. `sysctl -p`
12. `apt install shadowsocks-libev`
13. `systemctl disable shadowsocks-libev`
// /etc/shadowsocks-libev下的配置改完就需要执行下面的命令
14. systemctl restart shadowsocks-libev-server@config
15. 查看shadowsocks的状态命令：`systemctl status shadowsocks-libev-server@config`

## vpn
`wget https://git.io/vpnsetup -O vpnsetup.sh && sudo sh vpnsetup.sh`
输出的信息需要保存下来。
```
IPsec VPN server is now ready for use!

Connect to your new VPN with these details:

Server IP: 45.32.225.73
IPsec PSK: 6VUvVs4jGoSi87LK3dLp
Username: vpnuser
Password: 94rvmdYAj4dduNXS

Write these down. You'll need them to connect!

Important notes:   https://git.io/vpnnotes
Setup VPN clients: https://git.io/vpnclients

```
### 中标题

#### 小标题

## 第二个大标题

### 中标题

#### 小标题



