<template>
<div class="formdisplay">
  <form @submit.prevent="login" :class="{ error: failed }" data-cy="loginForm">
    <div class="logo">
      <img src="~#/../img/logo.svg" width="156" height="auto">
    </div>
    <input v-if="isDesktopApp" v-model="url" type="text" placeholder="Koel's Host" autofocus required>
    <input v-model="email" type="email" placeholder="Email Address" autofocus required>
    <input v-model="password" type="password" placeholder="Password" required>
    <btn type="submit">Log In</btn>
    <btn @click="showAddUserForm" green>Creat Account</btn>
  </form>
  
  <div class="modal-wrapper" :class="{ overlay: this.showingModalName }">
    <add-user-form v-if="showingModalName === 'add-user-form'" @close="close"/>
  </div>
  
    <!-- <div class="main-scroll-wrap">
      <div class="users">
        <user-card v-for="user in state.users" :user="user" @editUser="showEditUserForm" :key="user.id"/>
      </div>
    </div> -->
  </div>
</template>

<script>
import axios from 'axios'
import { userStore } from '@/stores'
import { ls } from '@/services'
import { event } from '@/utils'


const DEMO_ACCOUNT = {
  email: 'demo@gmail.com',
  password: 'demo@gmail.com'
}

export default {
  components: {
    Btn: () => import('@/components/ui/btn'),
    AddUserForm: () => import('@/components/user/add-form')
  },

  data: () => ({
    url: '',
    email: DEMO_ACCOUNT.email,
    password: DEMO_ACCOUNT.password,
    failed: false,
    isDesktopApp: KOEL_ENV === 'app',
    showingModalName: null,
    boundData: {}
  }),

  methods: {
    close () {
      this.showingModalName = null
      this.boundData = {}
    },
    showAddUserForm: () => event.emit(event.$names.MODAL_SHOW_ADD_USER_FORM),
    async login () {
      if (KOEL_ENV === 'app') {
        if (this.url.indexOf('http://') !== 0 && this.url.indexOf('https://') !== 0) {
          this.url = `https://${this.url}`
        }

        if (!this.url.endsWith('/')) {
          this.url = `${this.url}/`
        }

        axios.defaults.baseURL = `${this.url}api`
      }

      try {
        await userStore.login(this.email, this.password)
        this.failed = false

        // Reset the password so that the next login will have this field empty.
        this.password = ''

        if (KOEL_ENV === 'app') {
          ls.set('koelHost', this.url)
          ls.set('lastLoginEmail', this.email)
        }

        this.$emit('loggedin')
      } catch (err) {
        this.failed = true
        window.setTimeout(() => (this.failed = false), 2000)
      }
    }
  },

  mounted () {
    if (KOEL_ENV === 'app') {
      this.url = window.BASE_URL = ls.get('koelHost')
      this.email = ls.get('lastLoginEmail')
    }
    this.login()
  },

    created () {
    
    event.on({
      [event.$names.MODAL_SHOW_CREATE_SMART_PLAYLIST_FORM]: () => {
        this.showingModalName = 'create-smart-playlist-form'
      },

      [event.$names.MODAL_SHOW_EDIT_SMART_PLAYLIST_FORM]: playlist => {
        this.boundData.playlist = playlist
        this.showingModalName = 'edit-smart-playlist-form'
      },

      [event.$names.MODAL_SHOW_ADD_USER_FORM]: () => {
        this.showingModalName = 'add-user-form'
      },

      [event.$names.MODAL_SHOW_EDIT_USER_FORM]: user => {
        this.boundData.user = user
        this.showingModalName = 'edit-user-form'
      },

      [event.$names.MODAL_SHOW_EDIT_SONG_FORM]: songs => {
        this.boundData.songs = songs
        this.showingModalName = 'edit-song-form'
      },

      [event.$names.MODAL_SHOW_ABOUT_DIALOG]: () => {
        this.showingModalName = 'about-dialog'
      }
    })
  }
}
</script>

<style lang="scss" scoped>
/**
 * I like to move it move it
 * I like to move it move it
 * I like to move it move it
 * You like to - move it!
 */
@keyframes shake {
  8%, 41% {
    -webkit-transform: translateX(-10px);
  }
  25%, 58% {
    -webkit-transform: translateX(10px);
  }
  75% {
    -webkit-transform: translateX(-5px);
  }
  92% {
    -webkit-transform: translateX(5px);
  }
  0%, 100% {
    -webkit-transform: translateX(0);
  }
}

.formdisplay {
  display:none
}

form {
  width: 280px;
  padding: 1.8rem;
  background: rgba(255, 255, 255, .08);
  border-radius: .6rem;
  border: 1px solid #333;
  transition: .5s;

  &.error {
    border-color: #8e4947;
    animation: shake .5s;
  }

  .logo {
    text-align: center;
  }

  @media only screen and (max-width : 414px) {
    border: 0;
    background: transparent;
  }
}

input {
  display: block;
  margin-top: 12px;
  border: 0;
  background: #fff;
  outline: none;
  width: 100%;
}

button {
  display: block;
  margin-top: 12px;
  width: 100%;
}
</style>