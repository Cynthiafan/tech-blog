const utils = require('../.vuepress/utils');
require('dotenv').config();

module.exports = {
    title: '前端筆記 | Cynthia Fan',
    description: '',
    port: 8081,
    themeConfig: {
        smoothScroll: true,
        sidebar: [
            utils.generateSidebar('資料結構', 'articles/data-structure'),
            utils.generateSidebar('JavaScript', 'articles/javascript'),
            utils.generateSidebar('瀏覽器相關', 'articles/browser'),
            utils.generateSidebar('專案筆記', 'articles/lets-do-it'),
        ],
        locales: {
            '/': {
                nav: [
                    { text: '關於我', link: 'https://www.cynthiafan.com' },
                    { text: '技術筆記', link: '/articles/' },
                    { text: 'Github', link: 'https://github.com/Cynthiafan' },
                ],
            },
        }
    },
    markdown: {
        lineNumbers: true
    },
    plugins: [
        [
            '@vuepress/google-analytics',
            {
                'ga': 'UA-91843640-4'
            }
        ],
        [
            '@vssue/vuepress-plugin-vssue',
            {
                platform: 'github',
                owner: 'Cynthiafan',
                repo: 'tech-blog',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                labels: [':mailbox:Comments'],
                prefix: ['[Vssue] '],
                autoCreateIssue: true,
                issueContent: ({ url }) => {
                    return `This issue is auto created by Vssue to store comments of this page: ${url}`;
                },
            }
        ]
    ]
};