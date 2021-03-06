/* eslint camelcase: ["error", {properties: "never"}] */

import Vue from 'vue'
import { union, difference, take, orderBy } from 'lodash'

import stub from '@/stubs/album'
import { artistStore } from '.'

export const albumStore = {
  stub,
  cache: [],

  state: {
    albums: [stub]
  },

  /**
   * @param  {Array.<Object>} albums The array of album objects
   */
  init (albums) {
    // Traverse through the artists array and add their albums into our master album list.
    this.all = albums
    this.all.forEach(album => this.setupAlbum(album))
  },

  setupAlbum (album) {
    const artist = artistStore.byId(album.artist_id)
    artist.albums = union(artist.albums, [album])

    Vue.set(album, 'artist', artist)
    Vue.set(album, 'info', null)
    Vue.set(album, 'songs', [])
    Vue.set(album, 'playCount', 0)

    this.cache[album.id] = album

    return album
  },

  get all () {
    return this.state.albums
  },

  set all (value) {
    this.state.albums = value
  },

  byId (id) {
    return this.cache[id]
  },

  /**
   * @param  {Array.<Object>|Object} albums
   */
  add (albums) {
    [].concat(albums).forEach(album => {
      this.setupAlbum(album, album.artist)
      album.playCount = album.songs.reduce((count, song) => count + song.playCount, 0)
    })

    this.all = union(this.all, albums)
  },

  purify () {
    this.compact()
  },

  /**
   * Remove empty albums from the store.
   */
  compact () {
    const emptyAlbums = this.all.filter(album => album.songs.length === 0)
    if (!emptyAlbums.length) {
      return
    }

    this.all = difference(this.all, emptyAlbums)
    emptyAlbums.forEach(album => delete this.cache[album.id])
  },

  getMostPlayed (n = 6) {
    // Only non-unknown albums with actual play count are applicable.
    const applicable = this.all.filter(album => album.playCount && album.id !== 1)
    return take(orderBy(applicable, 'playCount', 'desc'), n)
  },

  getRecentlyAdded (n = 6) {
    const applicable = this.all.filter(album => album.id !== 1)
    return take(orderBy(applicable, 'created_at', 'desc'), n)
  }
}
