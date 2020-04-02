module.exports = {
  "title": "doudou",
  "description": "生活不只有前端",
  "dest": "dist",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "Home",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "TimeLine",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "Contact",
        "icon": "reco-message",
        "items": [
          // {
          //   "text": "NPM",
          //   "link": "https://www.npmjs.com/~reco_luan",
          //   "icon": "reco-npm"
          // },
          { text: 'GitHub', link: 'https://github.com/TypeInfos', icon: 'reco-github' },
          { text: '博客圆', link: 'https://www.cnblogs.com/doudoublog/', icon: 'reco-bokeyuan' },
          // {
          //   "text": "博客圆",
          //   "link": "https://www.cnblogs.com/luanhewei/",
          //   "icon": "reco-bokeyuan"
          // },
          // {
          //   "text": "WeChat",
          //   "link": "https://mp.weixin.qq.com/s/mXFqeUTegdvPliXknAAG_A",
          //   "icon": "reco-wechat"
          // }
        ]
      }
    ],
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "Category"
      },
      "tag": {
        "location": 3,
        "text": "Tag"
      }
    },
    // 首页右下键的友链
    "friendLink": [
      // {
      //   "title": "doudou",
      //   "desc": "Enjoy when you can, and endure when you must.",
      //   "email": "1156743527@qq.com",
      //   "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      //   "link": "https://www.recoluan.com"
      // },
    ],
    "logo": "/avatar.png",
    // 搜索设置
    "search": true,
    "searchMaxSuggestions": 10,
    // 自动形成侧边导航
    "sidebar": "auto",
    // 显示所有页面的标题链接
    displayAllHeaders: false,
    // 活动的标题链接
    activeHeaderLinks: true,
    "lastUpdated": "Last Updated",
    "author": "doudou",
    "authorAvatar": "/avatar.png",
    // "record": "xxxx",
    startYear: '陈金伙',
    // 评论
    valineConfig: {
      appId: 'WVINvnvFXAbxAjirQzbDruKP-gzGzoHsz', // your appId
      appKey: 'gar8bppl0vEVOiawaJUXrRM2', // your appKey
    },
    plugins: ['@vuepress/medium-zoom', 'flowchart', '@vuepress/last-updated']
  },
  "markdown": {
    "lineNumbers": true
  }
}
