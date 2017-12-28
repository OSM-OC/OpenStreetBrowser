var OpenStreetBrowserLoader = require('./OpenStreetBrowserLoader')
require('./addCategories.css')

var content

function addCategoriesShow (repo) {
  if (!content) {
    content = document.createElement('div')
    content.id = 'contentAddCategories'
    document.getElementById('content').appendChild(content)
  }

  content.innerHTML = 'Loading ...'
  document.getElementById('content').className = 'addCategories'

  OpenStreetBrowserLoader.getRepo(repo, {}, function (err, repoData) {
    while(content.firstChild)
      content.removeChild(content.firstChild)

    var backLink = document.createElement('a')
    backLink.className = 'back'
    backLink.href = '#'
    backLink.appendChild(document.createTextNode(lang('back')))

    var list = {}

    if (repo) {
      backLink.onclick = function () {
        addCategoriesShow()
        return false
      }
      content.appendChild(backLink)

      var h = document.createElement('h2')
      h.appendChild(document.createTextNode(repo))
      content.appendChild(h)

      list = repoData.categories
    } else {
      backLink.onclick = function () {
        addCategoriesHide()
        return false
      }
      content.appendChild(backLink)

      var h = document.createElement('h2')
      h.innerHTML = lang('more_categories')
      content.appendChild(h)

      list = repoData
    }

    var ul = document.createElement('ul')

    for (var id in list) {
      var data = list[id]

      var li = document.createElement('li')

      var a = document.createElement('a')
      if (repo) {
        a.href = '#categories=' + repo + '/' + id
        a.onclick = function () {
          addCategoriesHide()
        }
      } else {
        a.href = '#'
        a.onclick = function (id) {
          addCategoriesShow(id)
          return false
        }.bind(this, id)
      }

      li.appendChild(a)
      a.appendChild(document.createTextNode('name' in data ? lang(data.name) : id))

      if (config.urlCategoriesEditor) {
        a = document.createElement('a')
        if (repo) {
          a.href = config.urlCategoriesEditor + '?id=' + repo + '/' + id
        } else {
          a.href = config.urlCategoriesEditor + '?repo=' + id
        }
        a.target = '_blank'
        a.innerHTML = '<img src="img/edit.png"/>'
        li.appendChild(a)
      }

      ul.appendChild(li)
    }

    content.appendChild(ul)
  })
}

function addCategoriesHide () {
  document.getElementById('content').className = 'list'
}

register_hook('init', function (callback) {
  var link = document.createElement('a')
  link.className = 'addCategories'
  link.href = '#'
  link.onclick = function () {
    addCategoriesShow()
    return false
  }
  link.innerHTML = lang('more_categories')

  document.getElementById('contentList').appendChild(link)
})
