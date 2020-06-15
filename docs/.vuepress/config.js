const utils = require('../.vuepress/utils');
const format = require('date-fns').format;
require('dotenv').config();

module.exports = {
    title: '前端筆記 | Cynthia Fan',
    description: '',
    port: 8081,
    themeConfig: {
        lastUpdated: '最後編輯時間',
        smoothScroll: true,
        sidebar: [
            utils.generateSidebar('資料結構', 'posts/data-structure'),
            utils.generateSidebar('JavaScript', 'posts/javascript'),
            utils.generateSidebar('瀏覽器相關', 'posts/browser'),
            utils.generateSidebar('專案筆記', 'posts/lets-do-it'),
        ],
        locales: {
            '/': {
                nav: [
                    { text: '關於我', link: 'https://www.cynthiafan.com' },
                    { text: '技術筆記', link: '/posts/' },
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
            '@vuepress/last-updated',
            {
                transformer: (timestamp) => format(timestamp, 'yyyy/M/d HH:mm')
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