export default {
  template: `
    <div class="carousel-wrap" ref="carousel"
          data-auto="true" data-delay="5000"
          @mouseenter.stop="toggleTimer = false"
          @mouseleave.stop="toggleTimer = true"
          @touchstart.stop="touchStart"
          @touchmove.stop="touchMove"
          :style="'min-height:' + minHeight ">
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
      <a class="button-prev" href="#" @click.prevent="toPrev">
        <img src="//akveo.github.io/eva-icons/outline/png/128/arrow-ios-back-outline.png"/>
      </a>
      <a class="button-next" href="#" @click.prevent="toNext">
        <img src="//akveo.github.io/eva-icons/outline/png/128/arrow-ios-forward-outline.png"/>
      </a>
      <div class="dot-group">
        <a v-for="(l, i) in len" href="#"
            :class="{ 'active': show == i }"
            @click.prevent="show = i"
        ></a>
      </div>
    </div>
  `,
  data: function() {
    return {
      carouselName: 'carousel-next',
      carousels: [
        {
          img: 'https://picsum.photos/900/506?image=508',
          href: "#"
        },
        {
          img: 'https://picsum.photos/900/506?image=1068',
          href: "#"
        },
        {
          img: 'https://picsum.photos/900/506?image=509',
          href: "#"
        }
      ],
      len: 0,
      show: 0,
      xDown: null, // for swiper
      yDown: null, // for swiper
      autoplay: false, // 是否自動輪播
      timer: null, // auto play
      timerDelay: 3000, // 自動輪播間隔秒數
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
			}, this.timerDelay);
		}
	},
	mounted() {
		this.len = this.carousels.length;
		this.autoplay = this.$refs.carousel.dataset.auto == 'true';
		this.timerDelay = Number(this.$refs.carousel.dataset.delay) || 3000;
		if(this.autoplay) this.autoPlay();
		window.addEventListener('load', () => {
			this.minHeight = this.$refs.carousel.offsetHeight + 'px';
		});
	}
};