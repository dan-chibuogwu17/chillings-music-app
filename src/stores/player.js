import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default defineStore("player", {
  state: () => ({
    current_song: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
  }),
  actions: {
    async newSong(song) {
      this.current_song = song;
      this.sound = new Howl({
        src: [song.url],
        html5: true, //by using this the browser would use the HTML 5 ApI to retrieve audio files otherwise it would use ajax that would cause an error because the file is saved externally.
      });
      this.sound.play();

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });
    },
    async toggleAudio() {
      if (!this.sound.playing) {
        return;
      }
      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
    progress() {
      this.seek = helper.formatTime(this.sound.seek());
      this.duration = helper.formatTime(
        this.sound.duration() - this.sound.seek()
      );
      // to check if the song is still playing before repainting
      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
});
