const ops = '/ops'

export default {
    '/': [
        {
            text: '运维部署',
            children: [
                {
                    text: 'Docker',
                    prefix: `${ops}/docker/`,
                    children: [
                        {
                            text: 'docker 安装',
                            link: 'docker-install.md',
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
        {
            text: '前端开发',
        }
    ],
}