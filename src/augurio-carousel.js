const AugusrioCarousel = new Vue({
  el: '#app',
  data: {
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
		minHeight: 0, // 抓最小高度
		arrows: true, // 是否要有箭頭，預設 true
		dots: true // 是否要有小點，預設 true
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

		const data = this.$refs.carousel.dataset;
		this.autoplay = data.auto == 'true';
		this.timerDelay = Number(data.delay) || 3000;
		this.arrows = data.arrows == 'true';
		this.dots = data.dots == 'true';

		if(this.autoplay) this.autoPlay();
		
		window.addEventListener('load', () => {
			this.minHeight = this.$refs.carousel.offsetHeight + 'px';
		});
	},
});