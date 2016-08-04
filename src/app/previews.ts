interface JQueryStatic {
	bridget(name: string, options?: any): void;
}

interface PreviewsOptions {
	// ELEMENTS
	slides?: string;
	buttonNext?: string;
	buttonPrev?: string;
	paging?: string;
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
		slides: '.slide',
		buttonNext: '[data-next]',
		buttonPrev: '[data-prev]',
		paging: '.paging li',
		title: '.slide-title',
		// SETTINGS
		isLeft: false,
		isLeftClass: 'is-left',
		visibleClassSlide: 'visible',
		visibleClassPagging: 'active'
	};

	$element: JQuery;
	$slides: JQuery;
	$paging: JQuery;
	$buttonNext: JQuery;
	$buttonPrev: JQuery;
	$title: JQuery;
	options: PreviewsOptions;

	constructor(element: JQuery, options: PreviewsOptions) {
		this.$element = $(element);
		this.options = $.extend({}, Previews.defaultOptions, options);

		// Elements
		this.$slides = this.$element.find(this.options.slides);
		this.$paging = $(this.options.paging);
		this.$buttonNext = $(this.options.buttonNext);
		this.$buttonPrev = $(this.options.buttonPrev);
		this.$title = $(this.options.title);

		// init
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
		this.update(
			this.getCurrentSlide(),
			this.getNextSlide()
		);
	}

	prev() {
		this.update(
			this.getCurrentSlide(),
			this.getPrevSlide()
		);
	}

	show(index: number) {
		this.update(
			this.getCurrentSlide(),
			this.$slides.filter(' :eq(' + index + ')')
		);
	}

	update($currentSlide: JQuery, $next: JQuery) {
		this.changeSlide($currentSlide, $next);
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
		var $next = this.getCurrentSlide().next();

		if ($next.length === 0) {
			$next = this.$slides.first();
		}

		return $next;
	};

	// get Previous Slide
	private getPrevSlide() {
		var $prev = this.getCurrentSlide().prev();

		if ($prev.length === 0) {
			$prev = this.$slides.last();
		}

		return $prev;
	};

	// Change slide
	private changeSlide($current: JQuery, $next: JQuery) {
		$current.removeClass(this.options.visibleClassSlide);
		$next.addClass(this.options.visibleClassSlide);
	};

	// Create bindings
	private createBindings() {
		this.$buttonNext.on('click', $.proxy(this.next, this));
		this.$buttonPrev.on('click', $.proxy(this.prev, this));
		this.$paging.on('click', $.proxy(this.showSlideByClickingPaging, this));
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
		// remove from active
		this.$paging
			.filter('.' + this.options.visibleClassPagging)
			.removeClass(this.options.visibleClassPagging);
		// add to current
		this.$paging
			.filter(' :eq(' + this.getCurrentSlide().index() + ')')
			.addClass(this.options.visibleClassPagging);
	};

	// Update Title
	private updateTitle() {
		this.$title.text(this.getCurrentSlide().data('title'));
	};
}

$.bridget('previews', Previews);