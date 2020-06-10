const utils = require('../.vuepress/utils');

module.exports = {
    title: 'CynCode',
    description: '',
    port: 8081,
    themeConfig: {
        smoothScroll: true,
        sidebar: [
            'articles/data-structure',
            utils.generateSidebar('JavaScript', 'articles/javascript'),
            utils.generateSidebar('Side projects', 'articles/lets-do-it')
        ],
        locales: {
            '/': {
                nav: [
                    { text: 'About', link: 'https://www.cynthiafan.com' },
                    { text: 'Articles', link: '/articles/' },
                    { text: 'Github', link: 'https://github.com/Cynthiafan' },
                ],
            },
        }
    },
    plugins: {
        'google-tag-manager': { gtm: 'GTM-T9KF3SR' }
    }
};