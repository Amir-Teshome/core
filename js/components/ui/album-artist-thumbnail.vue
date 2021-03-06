<template>
  <span class="cover" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <a
      @click.prevent="playOrQueue"
      class="control control-play font-size-0"
      href
      role="button"
    >
      {{ buttonLabel }}
    </a>
  </span>
</template>

<script>
import { orderBy } from 'lodash'
import { queueStore } from '@/stores'
import { playback } from '@/services'
import { getDefaultCover } from '@/utils'

export default {
  props: {
    entity: {
      type: Object,
      required: true
    }
  },

  computed: {
    forAlbum () {
      return this.entity.hasOwnProperty('artist')
    },

    sortKeys () {
      return this.forAlbum ? ['disc', 'track'] : ['album_id', 'disc', 'track']
    },

    backgroundImageUrl () {
      return this.forAlbum
        ? this.entity.cover
          ? this.entity.cover
          : getDefaultCover()
        : this.entity.image
          ? this.entity.image
          : getDefaultCover()
    },

    buttonLabel () {
      return this.forAlbum
        ? `Play all songs in the album ${this.entity.name}`
        : `Play all songs by the artist ${this.entity.name}`
    },

    playbackFunc () {
      return this.forAlbum ? playback.playAllInAlbum : playback.playAllByArtist
    }
  },

  methods: {
    playOrQueue (e) {
      if (e.metaKey || e.ctrlKey) {
        queueStore.queue(orderBy(this.entity.songs, this.sortKeys))
      } else {
        this.playbackFunc.call(playback, this.entity, false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cover {
  position: relative;
  width: 100%;
  display: block;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  &::after {
    content: "";
    display: block;
    padding-top: 100%;
  }

  .control {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;

    &::before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      top: 0;
      background: rgba(0, 0, 0, .3);
      opacity: 0;
      z-index: 1;
    }

    &::after {
      content: "";
      width: 60%;
      max-width: 128px;
      height: 60%;
      max-height: 128px;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEzcHgiIGhlaWdodD0iMTMxcHgiIHZpZXdCb3g9IjAgMCAxMTMgMTMxIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9InRyaWFuZ2xlIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cG9seWdvbiBpZD0iUG9seWdvbiIgZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIxMTMuMDIzNzI5IDY1LjI1NDI4MDMgLTEuNTg1Njc4MzFlLTE0IDEzMC41MDg1NjEgLTUuNjg0MzQxODllLTE0IDAiPjwvcG9seWdvbj4KICAgIDwvZz4KPC9zdmc+);
      background-size: 45%;
      background-position: 58% 50%;
      background-repeat: no-repeat;
      border-radius: 50%;
      background-color: #000;
      opacity: 0;
      z-index: 2;
    }

    &:hover, &:focus {
      &::before, &::after {
        transition: .3s opacity;
        opacity: 1;
      }
    }

    &:active {
      &::before {
        background: rgba(0, 0, 0, .5);
      }

      &::after {
        transform: scale(.9);
      }
    }
  }
}
</style>
