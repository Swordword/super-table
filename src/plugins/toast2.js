var Toast = {}
Toast.install = function(Vue, options) {
	console.log('options', options)
	// Vue.prototype.$msg = 'Hello Plugin'
	Vue.component('BaseComp', {
		// template:`<h2>hello base-comp</h2>`
		props: ['someProp'],
		render: function(createElement) {
			return createElement('div', this.someProp)
		},
	})
	Vue.prototype.$toast = (tips) => {
		console.log('tips', tips)
		let toastTpl = Vue.extend({
			// template: `<div class="vue-toast">${tips}</div>`,
			render: function(createElement) {
				return createElement(
					'div',
					{
						class: {
							test: true,
						},
						style: {
							color: 'red',
							fontSize: '14px',
						},
					},
					[
						tips,
						createElement('h1', '子级标题'),
						createElement('BaseComp', {
							props: {
								someProp: 'someProp',
							},
						}),
					]
				)
			},
		})
		let tpl = new toastTpl().$mount().$el
		document.body.append(tpl)
		setTimeout(function() {
			document.body.removeChild(tpl)
		}, 200000)
	}
}
module.exports = Toast
