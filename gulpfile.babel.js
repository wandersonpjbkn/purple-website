// Gulp 4.0
import gulp from 'gulp'
import mode from 'gulp-mode'

// modules internal
import { paths, tasks } from './builder/gulp'

const now = () => {
  const date = new Date()
  const [now] = date.toTimeString().split(' ')

  return now
}

const replace = string => string.replace(/\\/g, '/')

const log = MODULE => {
  const ENV = String(mode().production()).toUpperCase()
  const NOW = now()
  const COLOR = {
    magenta: '\x1b[35m',
    cian: '\x1b[36m',
    white: '\x1b[39m',
    gray: '\x1b[90m',
  }

  const lines = [
    `\n[${COLOR.gray}${NOW}${COLOR.white}]`, // timespan
    'Gulp',
    `'${COLOR.cian}${MODULE}${COLOR.white}'`, // current module
    '(',
    `${COLOR.magenta}process.env.NODE_ENV${COLOR.white}`, // env title
    `'${COLOR.cian}production${COLOR.white}' :: ${COLOR.cian}${ENV}${COLOR.white}`, // if is PROD
    ')'
  ]

  console.log(lines.join(' '))
}

const sanitize = text => {
  const arr = []

  switch (typeof text) {
    case 'undefined':
      return

    case 'string':
      return replace(text)

    default:
      text.forEach(item => arr.push(replace(item)))
      return arr
  }
}

// watcher
const watcher = () => {
  log('watcher')

  Object
    .keys(paths)
    .forEach(key => {
      const src = sanitize(paths[key].src)
      const watch = sanitize(paths[key].watch)

      if (tasks[key]) gulp.watch(src, tasks[key])
      if (paths[key].watch) gulp.watch(watch, tasks[key])
    })
}

// build current theme
const builder = done => {
  const excludeTasks = ['clean']

  // gets all tasks
  const _tasks = Object
    .values(tasks)
    .filter(func => !excludeTasks.includes(func.name)) // prevent double run of some tasks

  log('builder')

  // run tasks
  return gulp.series(tasks.clean, ..._tasks)(() => done())
}

// Exports
module.exports = {
  build: builder,
  watch: watcher,
  clean: tasks.clean
}
