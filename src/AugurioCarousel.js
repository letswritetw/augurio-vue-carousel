export default {
  template: /*html*/`
    <div class="carousel-wrap" ref="carousel"
          @mouseenter.stop="toggleTimer = false"
          @mouseleave.stop="toggleTimer = true"
          @touchstart.stop="touchStart"
          @touchmove.stop="touchMove"
          :style="'min-height:' + minHeight">
          
      <keep-alive>

        <transition :name="carouselName">

          <div class="item"
                v-for="(s, i) in carousels"
                v-if="show == i"
                :key="i"
          >
            <a :href="s.href">
              <img :src="s.img"/>
            </a>
          </div>
          
        </transition>

      </keep-alive>

      <!-- arrows -->
      <div class="arrows-group" v-if="arrows">
        <a class="button-prev" href="#" @click.prevent="toPrev">
          <slot name="arrows-prev">
            <img src="//akveo.github.io/eva-icons/outline/png/128/arrow-ios-back-outline.png"/>
          </slot>
        </a>
        <a class="button-next" href="#" @click.prevent="toNext">
          <slot name="arrows-next">
            <img src="//akveo.github.io/eva-icons/outline/png/128/arrow-ios-forward-outline.png"/>
          </slot>
        </a>
      </div>

      <!-- dots -->
      <div class="dot-group" v-if="dots">
        <a v-for="(l, i) in len" href="#"
            :class="{ 'active': show == i }"
            @click.prevent="show = i"
        ></a>
      </div>

    </div>
  `,
  props: {
    carousels: {
      type: Array
    },
    auto: {
      type: Boolean,
      default: false
    },
    delay: {
      type: Number,
      default: 3000
    },
    dots: {
      type: Boolean,
      default: true
    },
    arrows: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      carouselName: 'carousel-next',
      len: 0,
      show: 0,
      xDown: null, // for swiper
      yDown: null, // for swiper
      autoplay: false, // 是否自動輪播
      toggleTimer: true, // pause auto play
      minHeight: 0 // 抓最小高度
    }
  },
  methods: {
		toNext() {
			this.carouselName = 'carousel-next';
			this.show + 1 >= this.len ? this.show = 0 : this.show = this.show + 1;
		},
		toPrev() {
			this.carouselName = 'carousel-prev';
			this.show - 1 < 0 ? this.show = this.len - 1 : this.show = this.show - 1;
		},
		// swiper event(for mobile)
		touchStart(e) {
			this.xDown = e.touches[0].clientX;
			this.yDown = e.touches[0].clientY;
		},
		touchMove(e) {
			const _this = this;
			if(!this.xDown || !this.yDown) { return; }

			let xUp = e.touches[0].clientX;
			let yUp = e.touches[0].clientY;

			let xDiff = this.xDown - xUp;
			let yDiff = this.yDown - yUp;

			if(Math.abs(xDiff) > Math.abs(yDiff)) {
				xDiff > 0 ? _this.toNext() : _this.toPrev();
			}
			this.xDown = null;
			this.yDown = null;
		},
		// 自動輪播
		autoPlay() {
			setInterval(() => {
				if(this.toggleTimer) this.toNext();
			}, this.delay);
		}
  },
	mounted() {
    this.len = this.carousels.length;
    if(this.len <= 1) this.arrows = false;
		if(this.auto) this.autoPlay();
		window.addEventListener('load', () => {
			this.minHeight = this.$refs.carousel.offsetHeight + 'px';
		});
	}
};