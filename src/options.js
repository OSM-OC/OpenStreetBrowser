/* globals form, ajax, options:true, showRootContent */
var moduleOptions = {}

register_hook('init', function () {
  var menu = document.getElementById('menu')

  var li = document.createElement('li')
  menu.appendChild(li)

  var link = document.createElement('a')
  link.innerHTML = lang('main:options')
  link.href = '#options'
  link.onclick = moduleOptions.open

  li.appendChild(link)
})

moduleOptions.open = function () {
  var def = {
    'debug': {
      'type': 'boolean',
      'name': 'Debug mode',
      'weight': 10,
      'reloadOnChange': true
    }
  }

  call_hooks('options_form', def)

  var optionsForm = new form('options', def)
  document.getElementById('content').className = 'options'
  var dom = document.getElementById('contentOptions')
  dom.innerHTML = ''

  optionsForm.set_data(options)

  var f = document.createElement('form')
  f.onsubmit = moduleOptions.submit.bind(this, optionsForm)
  dom.appendChild(f)

  optionsForm.show(f)

  var input = document.createElement('button')
  input.innerHTML = lang('save')
  f.appendChild(input)

  return false
}

moduleOptions.submit = function (optionsForm) {
  var data = optionsForm.get_data()

  var reload = false
  for (var k in data) {
    if (optionsForm.def[k].reloadOnChange && options[k] !== data[k]) {
      reload = true
    }
  }

  if (reload) {
    location.reload()
  }

  ajax('options_save', null, data, function (ret) {
    call_hooks('options_save', data)

    options = data

    showRootContent()
  })

  return false
}

module.exports = moduleOptions
