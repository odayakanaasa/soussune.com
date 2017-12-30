import { DateTime } from 'luxon'
import * as EpisodeHelper from '~/helpers/EpisodeHelper.js'
import ActorIcon from '~/components/ActorIcon.vue'

export default {
  components: {
    ActorIcon
  },
  filters: {
    date (episode) {
      return DateTime.fromMillis(episode.published).toFormat('yyyy年MM月dd日')
    },
    desc (episode) {
      return EpisodeHelper.desc(episode)
    }
  },
  asyncData ({ store, route }) {
    return {
      episode: store.getters.episodeByPath(route.path)
    }
  },
  computed: {
    src (): string {
      return 'https://cdn.soussune.com/audio' + this.episode.audioFilePath
    },
    playing (): boolean {
      return this.selected && !this.paused
    },
    canplay (): boolean {
      return this.$store.state.audio.canplay
    },
    selected (): boolean {
      return this.$store.state.audio.src === this.src
    },
    paused (): boolean {
      return this.$store.state.audio.paused
    }
  },
  head () {
    return {
      title: this.episode.title
    }
  },
  mounted () {
    this.loadTwitterWidget()
    this.$store.watch((state) => state.actors, this.updateEpisode)
  },
  updated () {
    this.loadTwitterWidget()
  },
  methods: {
    updateEpisode () {
      this.episode = this.$store.getters.episodeByPath(this.$route.path)
    },
    commit (prop: string, payload: any): void {
      this.$store.commit(`audio/${prop}`, payload)
    },
    togglePlay (): void {
      if (this.selected) {
        this.commit('paused', !this.paused)
        return
      }

      this.commit('src', this.src)
      this.commit('title', this.episode.title)
    },
    loadTwitterWidget (): void {
      // Reload twitter widget for this episode when already loaded on root
      if (window['twttr']) window['twttr'].widgets.load(this.$refs.content)
    }
  }
}
