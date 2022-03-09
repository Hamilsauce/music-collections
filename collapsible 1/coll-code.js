const $ = (selector = '*', el = document) => el.querySelector(selector)
const $$ = (selector='*', el = document) => el.querySelectorAll(selector)

const collapsibleHeaders = $$('.series-collapsible')

const expandSeries = (seriesContent, childScrollHeight) => {
	seriesContent.style.zIndex = 30;
	if (childScrollHeight) {
		seriesContent.style.maxHeight = `${parseInt(seriesContent.style.maxHeight) + parseInt(childScrollHeight)}px`;
	} else {
		seriesContent.style.maxHeight = seriesContent.scrollHeight + "px";
	}
}

collapsibleHeaders.forEach(el => {
	el.addEventListener('click', e => {
		el.classList.toggle('active');

		let content = el.nextElementSibling;
		if (content.style.maxHeight) {
			const childContents = [...$$('.content',content)];

			childContents.forEach(ch => {
				ch.style.maxHeight = null
				ch.style.zIndex = 0
				ch.classList.add('hide')
			});
			content.style.maxHeight = null;
			content.style.zIndex = 0;
		} else {
			expandSeries(content)
		}
	});
});
