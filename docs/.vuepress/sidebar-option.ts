const ops = '/ops'
const code = '/code'

export default {
    '/': [
        {
            text: '编程语言',
            children: [
                {
                    text: "vite",
                    prefix: `${code}/vite`,
                    children: [
                        {
                            text: "import导入",
                            link: "import.md"
                        }
                    ]
                },
                {
                    text: "vue",
                    prefix: `${code}/vue`,
                    children: [
                        {
                            text: "avuejs",
                            link: "Avuejs.md"
                        },
                        {
                            text: "vue构建nginx",
                            link: "vue-nginx.md"
                        }
                    ]
                }
            ]
        },
        {
            text: '运维部署',
            children: [
                {
                    text: 'Docker',
                    prefix: `${ops}/docker/`,
                    children: [
                        {
                            text: 'docker 安装',
                            link: 'install.md',
                        },
                        {
                            text: 'docker-compose 使用',
                            link: 'docker-compose.md',
                        },
                        {
                            text: 'docker 镜像问题',
                            link: 'docker-pull-image-error.md',
                        },
                        {
                            text: 'docker 单容器部署-样例',
                            link: 'docker-single-node.md',
                        },
                        {
                            text: 'docker 常用命令使用',
                            link: 'docker-use.md',
                        },
                        {
                            text: 'dockerfile 编写',
                            link: 'dockerfile.md',
                        },
                    ]
                }
            ],
        },
    ],
}