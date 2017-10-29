module.exports = {
  content: [
    [
      'lessons',
      {
        permalink: ':slug',
        page: '/_slug',
        generate: ['get', 'getAll'],
        isPost: false
      }
    ],
    [
      'case-studies',
      {
        permalink: '/case-studies/:slug',
        page: '/case-studies/_slug',
        generate: ['get', 'getAll'],
        isPost: false
      }
    ]
  ]
}
