// nuxt.js  的配置文件

module.exports = {
    router: {
        linkActiveClass: "active",
        // 自定义路由表
        extendRoutes(routes, resolve) {
            // 清除默认路由表规则 Nuxt.js基于pages目录默认生成的路由表规则
            routes.splice(0)
            // console.log(routes)
            routes.push(...[
                {
                    path: "/",
                    component: resolve(__dirname, "pages/layout/"),
                    children: [
                        {
                            path: '', // 默认子路由
                            name: 'home',
                            component: resolve(__dirname, "pages/home/"),
                        },
                        {
                            path: '/login', // 默认子路由
                            name: 'login',
                            component: resolve(__dirname, "pages/login/"),
                        },
                        {
                            path: '/register', // 默认子路由
                            name: 'register',
                            component: resolve(__dirname, "pages/login/"),
                        },
                        {
                            path: '/profile/:username', // 默认子路由
                            name: 'profile',
                            component: resolve(__dirname, "pages/profile/"),
                        },
                        {
                            path: '/settings', // 默认子路由
                            name: 'settings',
                            component: resolve(__dirname, "pages/settings/"),
                        },
                        {
                            path: '/editor/:slug?', // 默认子路由
                            name: 'editor',
                            component: resolve(__dirname, "pages/editor/"),
                        },
                        {
                            path: '/article/:slug', // 默认子路由
                            name: 'article',
                            component: resolve(__dirname, "pages/article/"),
                        },
                    ]
                }
            ])
        }
    },

    server: {
        // 监听：
        // localhost/127.0.0.1-只有本机能访问到这个IP
        // 本机内网IP-同一局域网内的机器也能访问到这个IP
        // 0.0.0.0-不在同一局域网内的机器也能访问到本机的外网IP
        host: '0.0.0.0',
        port: 3000
    },
    // 注册插件
    plugins: [
        "~/plugins/request.js",
        '~/plugins/dayjs.js'
    ]    
}