interface JQueryStatic {
	bridget(name: string, options?: any): void;
}

interface PreviewsOptions {
	// ELEMENTS
	slides?: string;
	buttonNext?: string;
	buttonPrev?: string;
	pagging?: string;
	title?: string;
	// SETTINGS
	isLeft?: boolean;
	isLeftClass?: string;
	visibleClassSlide?: string;
	visibleClassPagging?: string;
}

class Previews {
	static defaultOptions: PreviewsOptions = {
		// ELEMENTS
		slides: 'slide',
		buttonNext: '[data-next]',
		buttonPrev: '[data-prev]',
		pagging: '.paging li',
		title: '.slide-title',
		// SETTINGS
		isLeft: false,
		isLeftClass: 'is-left',
		visibleClassSlide: 'visible',
		visibleClassPagging: 'active'
	};

	$element: JQuery;
	$slides: JQuery;
	$currentSlide: JQuery;
	$prev: JQuery;
	$next: JQuery;
	options: PreviewsOptions;

	constructor(element: JQuery, options: PreviewsOptions) {
		this.$element = $(element);
		this.options = $.extend({}, Previews.defaultOptions, options);
		this.$slides = this.$element.find('.' + this.options.slides);

		this.init();
	}

	init() {
		if (this.options.isLeft) {
			this.$element.addClass(this.options.isLeftClass);
		}

		this.createBindings();
		this.updatePagging();
		this.updateTitle();
	}

	next() {
		this.$currentSlide = this.getCurrentSlide();
		this.$next = this.getNextSlide();

		this.changeSlide(this.$currentSlide, this.$next);
		this.updatePagging();
		this.updateTitle();
	}

	prev() {
		this.$currentSlide = this.getCurrentSlide();
		this.$prev = this.getPrevSlide();

		this.changeSlide(this.$currentSlide, this.$prev);
		this.updatePagging();
		this.updateTitle();
	}

	show(index: number) {
		this.$currentSlide = this.getCurrentSlide();
		this.$next = this.$slides.filter(' :eq(' + index + ')');

		this.changeSlide(this.$currentSlide, this.$next);
		this.updatePagging();
		this.updateTitle();
	}

	///////////////////////
	// PRIVATE FUNCTIONS //
	///////////////////////
	// get Current Slide
	private getCurrentSlide() {
		return this.$slides.filter('.' + this.options.visibleClassSlide);
	};

	// get Next Slide
	private getNextSlide() {
		this.$next = this.getCurrentSlide().next();

		if (this.$next.length === 0) {
			this.$next = this.$slides.first();
		}

		return this.$next;
	};

	// get Previous Slide
	private getPrevSlide() {
		this.$prev = this.getCurrentSlide().prev();

		if (this.$prev.length === 0) {
			this.$prev = this.$slides.last();
		}

		return this.$prev;
	};

	// Change slide
	private changeSlide($current: JQuery, $next: JQuery) {
		$current.removeClass(this.options.visibleClassSlide);
		$next.addClass(this.options.visibleClassSlide);
	};

	// Create bindings
	private createBindings() {
		$(this.options.buttonNext).on('click', $.proxy(this.next, this));
		$(this.options.buttonPrev).on('click', $.proxy(this.prev, this));
		$(this.options.pagging).on('click', $.proxy(this.showSlideByClickingPaging, this));
		$(document).on('keyup', $.proxy(this.showSlideByHittingKeyboard, this));
	};

	private showSlideByClickingPaging(event: JQueryEventObject) {
		this.show($(event.target).index());
	}

	private showSlideByHittingKeyboard(event: JQueryEventObject) {
		if (event.keyCode === 39) {
			this.next();
		} else if (event.keyCode === 37) {
			this.prev();
		}
	}

	// Update Pagging
	private updatePagging() {
		var index = this.getCurrentSlide().index();

		$(this.options.pagging).filter('.' + this.options.visibleClassPagging).removeClass(this.options.visibleClassPagging);
		$(this.options.pagging).filter(' :eq(' + index + ')').addClass(this.options.visibleClassPagging);
	};

	// Update Title
	private updateTitle() {
		this.$currentSlide = this.getCurrentSlide();
		$(this.options.title).text(this.$currentSlide.data('title'));
	};
}

$.bridget('previews', Previews);