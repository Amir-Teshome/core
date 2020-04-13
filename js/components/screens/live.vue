<template>
  <section id="songsWrapper">
    <h1 class="heading">
      <span v-show="ok">Live</span>
    </h1>
    <div class="iframeWrapper">
        <iframe src="https://mixlr.com/users/4104945/embed" 
            width="100%" height="180px" scrolling="no" 
            frameborder="no" marginheight="0" marginwidth="0">
        </iframe>
        <!-- <vue-friendly-iframe :src="example1Form.src"></vue-friendly-iframe> -->
    </div>
    
  </section>
</template>

<script>

export default {
  name: "live",
  
  components: {
  },

  data: () => ({
      ok: true,
      example1Form: {
          src: "https://mixlr.com/users/4104945/embed"
      }

  })
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#albumsWrapper {
  .albums {
    @include artist-album-wrapper();
  }
}

.iframeWrapper {
    margin: 1em;
}


</style>
