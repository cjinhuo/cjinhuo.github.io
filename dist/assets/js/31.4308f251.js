(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{400:function(s,t,e){"use strict";e.r(t);var n=e(4),a=Object(n.a)({},(function(){var s=this,t=s.$createElement,e=s._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[s._v("VPN搭建步骤")]),s._v(" "),e("ol",[e("li",[s._v("去国外买个服务器")]),s._v(" "),e("li",[s._v("搭建shadowsocks（主要用于网页浏览）")]),s._v(" "),e("li",[s._v("搭建vpn（适用于所有的client，包括browser）")])])]),s._v(" "),e("ol",[e("li",[e("a",{attrs:{href:"https://my.vultr.com/",target:"_blank",rel:"noopener noreferrer"}},[s._v("vultr"),e("OutboundLink")],1)]),s._v(" "),e("li",[e("code",[s._v("ssh root@ip")]),s._v("（用于mac链接linux服务器）")]),s._v(" "),e("li",[e("code",[s._v("vim /etc/ssh/sshd_config")]),s._v("（更改#port 22 => port 20000）")]),s._v(" "),e("li",[e("code",[s._v("reboot")])]),s._v(" "),e("li",[e("code",[s._v("ssh -p 20000 root@id")])]),s._v(" "),e("li",[e("code",[s._v("apt update")]),s._v("、"),e("code",[s._v("apt dist-upgrade")]),s._v("（升级系统）然后"),e("code",[s._v("reboot")])]),s._v(" "),e("li",[e("code",[s._v('echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf')]),s._v("（将net.core.default_qdisc=fq追加到sysctl.conf文件）")]),s._v(" "),e("li",[e("code",[s._v('echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf')]),s._v("（将net.ipv4.tcp_congestion_control=bbr追加到sysctl.conf文件）")]),s._v(" "),e("li",[e("code",[s._v("sysctl -p")]),s._v("（从指定的文件加载系统参数，如不指定即从/etc/sysctl.conf中加载）")]),s._v(" "),e("li",[e("code",[s._v('echo "net.ipv4.tcp_fastopen = 3" >> /etc/sysctl.conf')])]),s._v(" "),e("li",[e("code",[s._v("sysctl -p")]),s._v("（从指定的文件加载系统参数，如不指定即从/etc/sysctl.conf中加载）")]),s._v(" "),e("li",[e("code",[s._v("apt install shadowsocks-libev")])]),s._v(" "),e("li",[e("code",[s._v("systemctl disable shadowsocks-libev")])]),s._v(" "),e("li",[e("code",[s._v("nano /etc/shadowsocks-libev/config")]),s._v(" (更改配置信息，其中包括密码，模式)")])]),s._v(" "),e("div",{staticClass:"language-js line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  method"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v("'aes-256-gcm'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  port"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v("'20001'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 随意")]),s._v("\n  "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"fast_open"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"mode"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"tcp_and_udp"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"local_port"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1080")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"timeout"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("60")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br"),e("span",{staticClass:"line-number"},[s._v("6")]),e("br"),e("span",{staticClass:"line-number"},[s._v("7")]),e("br"),e("span",{staticClass:"line-number"},[s._v("8")]),e("br")])]),e("ol",{attrs:{start:"15"}},[e("li",[e("code",[s._v("systemctl enable shadowsocks-libev-server@config")])]),s._v(" "),e("li",[e("code",[s._v("systemctl restart shadowsocks-libev-server@config")])]),s._v(" "),e("li",[e("code",[s._v("systemctl status shadowsocks-libev-server@config")]),s._v(" (查看shadowsocks的状态命令)")]),s._v(" "),e("li",[s._v("当状态正常但是本地连小飞机上不了Google的时候把config.json的server字段删除。也就是从14行开始，删除config的第一行。")])]),s._v(" "),e("h2",{attrs:{id:"vpn"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vpn"}},[s._v("#")]),s._v(" vpn")]),s._v(" "),e("div",{staticClass:"custom-block tip"},[e("p",[e("code",[s._v("wget https://git.io/vpnsetup -O vpnsetup.sh && sudo sh vpnsetup.sh")]),e("br")])]),s._v(" "),e("p",[s._v("执行完上面的代码后，将会输出类似下面这种信息，你需要把信息保存起来。"),e("br"),s._v(" "),s._v("\nIPsec VPN server is now ready for use!"),e("br"),s._v("\nConnect to your new VPN with these details:"),e("br")]),s._v(" "),e("ul",[e("li",[s._v("Server IP: 45.77.87.244")])])])}),[],!1,null,null,null);t.default=a.exports}}]);