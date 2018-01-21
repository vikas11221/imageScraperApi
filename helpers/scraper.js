'use strict'

var Nightmare = require('nightmare')
	, RateLimiter = require('limiter').RateLimiter
	, EventEmitter = require('events')


/**
 * Get the image src for images, options specify the details.
 * Source: https://github.com/pevers/images-scraper
 */

class Scraper extends EventEmitter {

	/**
     * @constructor
     * 
     * Creates a new instance.
     * 
     * @param {String} options - properties to initialize scrapper.
     */

	constructor(options) {
		super()

		this.num = options.num || 10
		this.rlimit = new RateLimiter(options.rlimit || 0, 'second');
		this.userAgent = options.userAgent || 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
		this.noptions = options.nightmare || {};
		this.timeout = options.timeout || 10000;
		this.advanced = options.advanced;
	}

	async search(keyword) {

		if (!keyword) return Promise.reject(new Error('no keyword provided'));

		this.keyword = keyword;

		let res = await this._links()

		if (this.num) {
			res = res.slice(0, this.num);
		}

		res.filter((r) => {
			return r !== null;
		});

		this.emit('end', res);

		return res;

	}


	/**
	 * Returns a complete list of all the image details. Changed interval and animate time because. 
	 * All the pages are not scaneed if we want to download hundreds of images
	 */
	_links() {
		var self = this;
		var search_base = 'https://www.google.com/search?q=%&source=lnms&tbm=isch&sa=X';
		if (this.advanced) {
			var base = '&tbs=';
			var build = [];
			if (this.advanced.resolution) {
				build.push('isz:' + this.advanced.resolution);
			}
			if (this.advanced.imgType) {
				build.push('itp:' + this.advanced.imgType);
			}
			if (this.advanced.color) {
				build.push('ic:' + this.advanced.color);
			}

			build = build.length > 1 ? build.join(',') : build[0];
			search_base += '&tbs=' + build;
		}
		return Promise.resolve(
			new Nightmare(self.noptions)
				.useragent(self.userAgent)
				.goto(search_base.replace('%', encodeURIComponent(self.keyword)))
				.wait()
				.inject('js', __dirname + '/../libs/jquery-2.1.4.min.js')

				.evaluate(function (timeout) {
					$.data(document, 'timeout', false);
					setTimeout(function () {
						$.data(document, 'timeout', true);
					}, timeout);

					setInterval(function () {
						$('html, body').animate({ scrollTop: $(document).height() }, 500);

						var button = $('.ksb._kvc');	// try to load more
						if (button) {
							$.data(document, 'finished', false);
							button.click();
						}
					}, 500);

					// catch all AJAX events such that we can determine when we are finished
					var oldSend = XMLHttpRequest.prototype.send;
					XMLHttpRequest.prototype.send = function () {
						var oldOnReady = this.onreadystatechange;
						this.onreadystatechange = function () {
							oldOnReady.call(this);
							if (this.readyState === XMLHttpRequest.DONE)
								$.data(document, 'finished', true);
						}
						oldSend.apply(this, arguments);
					}
				}, self.timeout)
				.wait(function () {
					return (($(window).scrollTop() + $(window).height() == $(document).height()) &&
						!$('.ksb._kvc').is(':visible') &&
						$.data(document, 'finished')) || $.data(document, 'timeout');
				})

				.evaluate(function () {
					// get all the src's
					var results = [];
					$('.rg_l').each(function () {
						var meta = JSON.parse($(this).parent().find('.rg_meta').text());

						var item = {
							type: 'image/' + meta.ity,
							width: meta.ow,
							height: meta.oh,
							// size: meta.os.match(/[-+]?(\d*[.])?\d+/)[0], // fails query as property no longer exists
							url: meta.ou,
							thumb_url: meta.tu,
							thumb_width: meta.tw,
							thumb_height: meta.th
							// unit: meta.os.match(/\D+/).slice(-1)[0] // fails query as property no longer exists
						};
						results.push(item);
					});
					return results;
				}).end()
		);
	}
}

module.exports = Scraper;
