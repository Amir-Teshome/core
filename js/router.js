import isMobile from 'ismobilejs'

import { loadMainView } from './utils'
import { artistStore, albumStore, songStore, queueStore, playlistStore, userStore } from './stores'
import { playback } from './services'
import { views } from '@/config'
import { use } from '@/utils'

export default {
  routes: {
    '/home': () => loadMainView(views.HOME),
    '/queue': () => loadMainView(views.QUEUE),
    '/songs': () => loadMainView(views.SONGS),
    '/albums': () => loadMainView(views.ALBUMS),
    '/live': () => loadMainView(views.LIVE),
    '/artists': () => loadMainView(views.ARTISTS),
    '/favorites': () => loadMainView(views.FAVORITES),
    '/recently-played': () => loadMainView(views.RECENTLY_PLAYED),
    '/settings': () => userStore.current.is_admin && loadMainView(views.SETTINGS),
    '/users': () => userStore.current.is_admin && loadMainView(views.USERS),
    '/youtube': () => loadMainView(views.YOUTUBE),
    '/visualizer': () => loadMainView(views.VISUALIZER),
    '/profile': () => loadMainView(views.PROFILE),
    '/album/(\\d+)': id => use(albumStore.byId(~~id), album => loadMainView(views.ALBUM, album)),
    '/artist/(\\d+)': id => use(artistStore.byId(~~id), artist => loadMainView(views.ARTIST, artist)),
    '/playlist/(\\d+)': id => use(playlistStore.byId(~~id), playlist => loadMainView(views.PLAYLIST, playlist)),

    '/song/([a-z0-9]{32})': id => use(songStore.byId(id), song => {
      if (isMobile.apple.device) {
        // Mobile Safari doesn't allow autoplay, so we just queue.
        queueStore.queue(song)
        loadMainView(views.QUEUE)
      } else {
        playback.queueAndPlay(song)
      }
    })
  },

  init () {
    this.loadState()
    window.addEventListener('popstate', () => this.loadState(), true)
  },

  loadState () {
    if (!window.location.hash) {
      return this.go('home')
    }

    Object.keys(this.routes).forEach(route => {
      const matches = window.location.hash.match(new RegExp(`^#!${route}$`))
      if (matches) {
        const [, ...params] = matches
        this.routes[route](...params)
        return false
      }
    })
  },

  /**
   * Navigate to a (relative, hash-bang'ed) path.
   *
   * @param  {String|Number} path
   */
  go: path => {
    if (window.__UNIT_TESTING__) {
      return
    }

    if (path instanceof Number) {
      window.history.go(path)
      return
    }

    if (path[0] !== '/') {
      path = `/${path}`
    }

    if (path.indexOf('/#!') !== 0) {
      path = `/#!${path}`
    }

    path = path.substring(1, path.length)
    document.location.href = `${document.location.origin}${document.location.pathname}${path}`
  }
}
