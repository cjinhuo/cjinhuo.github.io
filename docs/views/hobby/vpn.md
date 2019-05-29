---
title: 'VPN搭建'
  # 大标题
sidebarDepth: 2
sidebar: auto
categories: 
- hobby
# 分类 共有三个分类： frontEnd work hobby
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
6. `apt update`、`apt dist-upgrade`（升级系统）
7. `echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf`（将net.core.default_qdisc=fq追加到sysctl.conf文件）
8. `echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf`（将net.ipv4.tcp_congestion_control=bbr追加到sysctl.conf文件）
9. `sysctl -p`（从指定的文件加载系统参数，如不指定即从/etc/sysctl.conf中加载）
10. `echo "net.ipv4.tcp_fastopen = 3" >> /etc/sysctl.conf`
11. `sysctl -p`（从指定的文件加载系统参数，如不指定即从/etc/sysctl.conf中加载）
12. `apt install shadowsocks-libev`
13. `systemctl disable shadowsocks-libev`
// /etc/shadowsocks-libev下的配置改完就需要执行下面的命令
14. systemctl restart shadowsocks-libev-server@config
15. 查看shadowsocks的状态命令：`systemctl status shadowsocks-libev-server@config`

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
* Server IP: `45.32.225.73`
* IPsec PSK: `6VUvVs4jGoSi87LK3dLp`
* Username: `vpnuser`
* Password: `94rvmdYAj4dduNXS`




